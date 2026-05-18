import { defineStore } from 'pinia'
import { levels } from '../data/levels'
import { achievements } from '../data/achievements'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

const emptyState = () => ({
  isLoading: false,
  authReady: false,
  registered: false,
  userId: null,
  userName: '',
  email: '',
  avatar: 'avatar1',
  avatarChanged: false,
  completedLevels: [],
  scores: {},
  projects: [],
  publicProjects: [],
  errorMessage: ''
})

export const useAppStore = defineStore('app', {
  state: () => emptyState(),

  getters: {
    completedCount: (state) => state.completedLevels.length,

    totalScore: (state) => {
      return state.completedLevels.reduce((sum, id) => sum + (state.scores[id] || 0), 0)
    },

    averageScore() {
      if (this.completedCount === 0) return 0
      return Math.round(this.totalScore / this.completedCount)
    },

    progressPercent() {
      return Math.round((this.completedCount / levels.length) * 100)
    },

    canGetCertificate() {
      return this.completedCount >= levels.length && this.averageScore >= 70
    },

    unlockedAchievements() {
      return achievements.filter((item) => item.condition(this))
    },

    achievementList() {
      return achievements.map((item) => ({
        ...item,
        unlocked: item.condition(this)
      }))
    },

    status() {
      if (this.completedCount >= 10) return 'Експерт'
      if (this.completedCount >= 5) return 'Практик'
      if (this.completedCount >= 2) return 'Учень'
      return 'Новачок'
    }
  },

  actions: {
    setError(message) {
      this.errorMessage = message || ''
    },

    async initAuth() {
      if (!isSupabaseConfigured) {
        this.authReady = true
        this.setError('Supabase ще не підключено. Перевірте .env та GitHub Variables.')
        return
      }

      this.isLoading = true
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        this.setError(error.message)
        this.isLoading = false
        this.authReady = true
        return
      }

      if (data.session?.user) {
        await this.loadUserData(data.session.user)
      }

      supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          await this.loadUserData(session.user)
        } else {
          this.$patch(emptyState())
          this.authReady = true
        }
      })

      this.isLoading = false
      this.authReady = true
    },

    async register({ name, email, password }) {
      this.setError('')

      if (!isSupabaseConfigured) {
        this.setError('Supabase не підключено.')
        return false
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } }
      })

      if (error) {
        this.setError(error.message)
        return false
      }

      if (data.user && data.session) {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          name,
          email,
          avatar: this.avatar
        })

        await this.loadUserData(data.user)
        return true
      }

      this.email = email
      this.userName = name
      this.setError('Реєстрацію створено. Перевірте пошту або вимкніть підтвердження email у Supabase Auth.')
      return true
    },

    async login({ email, password }) {
      this.setError('')

      if (!isSupabaseConfigured) {
        this.setError('Supabase не підключено.')
        return false
      }

      const { data, error } = await supabase.auth.signInWithPassword({ email, password })

      if (error) {
        this.setError(error.message)
        return false
      }

      await this.loadUserData(data.user)
      return true
    },

    async loadUserData(user) {
      if (!user || !isSupabaseConfigured) return

      this.userId = user.id
      this.email = user.email || ''
      this.registered = true

      let { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle()

      if (!profile) {
        const fallbackName = user.user_metadata?.name || user.email?.split('@')[0] || 'Користувач'
        const { data: insertedProfile } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            name: fallbackName,
            email: user.email || '',
            avatar: 'avatar1'
          })
          .select()
          .single()

        profile = insertedProfile
      }

      this.userName = profile?.name || user.user_metadata?.name || 'Користувач'
      this.avatar = profile?.avatar || 'avatar1'

      const { data: progressRows } = await supabase
        .from('level_progress')
        .select('level_id, score')
        .eq('user_id', user.id)

      this.completedLevels = (progressRows || []).map((row) => row.level_id)
      this.scores = {}
      for (const row of progressRows || []) {
        this.scores[row.level_id] = row.score
      }

      const { data: projectRows } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      this.projects = (projectRows || []).map((project) => ({
        id: project.id,
        title: project.title,
        description: project.description || '',
        image: project.image_url || '',
        author: this.userName,
        isPublic: project.is_public,
        variant: 'bars'
      }))

      await this.loadPublicProjects()
    },

    async loadPublicProjects() {
      if (!isSupabaseConfigured) return

      const { data } = await supabase
        .from('projects')
        .select('id, title, description, image_url, is_public, created_at')
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(20)

      this.publicProjects = (data || []).map((project) => ({
        id: project.id,
        title: project.title,
        description: project.description || '',
        image: project.image_url || '',
        author: 'Інший користувач',
        isPublic: true,
        variant: 'bars'
      }))
    },

    async completeLevel(levelId, score) {
      if (!this.userId || !isSupabaseConfigured) {
        this.setError('Щоб зберегти прогрес, потрібно увійти в акаунт.')
        return
      }

      const finalScore = Math.max(this.scores[levelId] || 0, score)

      const { error } = await supabase
        .from('level_progress')
        .upsert({
          user_id: this.userId,
          level_id: levelId,
          score: finalScore,
          completed_at: new Date().toISOString()
        }, { onConflict: 'user_id,level_id' })

      if (error) {
        this.setError(error.message)
        return
      }

      if (!this.completedLevels.includes(levelId)) {
        this.completedLevels.push(levelId)
      }

      this.scores[levelId] = finalScore
      await this.saveAchievements()
    },

    async saveAchievements() {
      if (!this.userId || !isSupabaseConfigured) return

      const rows = this.unlockedAchievements.map((achievement) => ({
        user_id: this.userId,
        achievement_key: achievement.id
      }))

      if (rows.length) {
        await supabase
          .from('achievements')
          .upsert(rows, { onConflict: 'user_id,achievement_key' })
      }
    },

    async setAvatar(avatar) {
      this.avatar = avatar
      this.avatarChanged = true

      if (this.userId && isSupabaseConfigured) {
        await supabase
          .from('profiles')
          .update({ avatar })
          .eq('id', this.userId)
      }
    },

    async addProject(project) {
      if (!this.userId || !isSupabaseConfigured) {
        this.setError('Щоб зберегти роботу, потрібно увійти в акаунт.')
        return false
      }

      const { data, error } = await supabase
        .from('projects')
        .insert({
          user_id: this.userId,
          title: project.title,
          description: project.description,
          image_url: project.image || '',
          is_public: project.isPublic
        })
        .select()
        .single()

      if (error) {
        this.setError(error.message)
        return false
      }

      this.projects.unshift({
        id: data.id,
        title: data.title,
        description: data.description || '',
        image: data.image_url || '',
        author: this.userName || 'Користувач',
        isPublic: data.is_public,
        variant: 'bars'
      })

      await this.loadPublicProjects()
      await this.saveAchievements()
      return true
    },

    async logout() {
      if (isSupabaseConfigured) {
        await supabase.auth.signOut()
      }

      this.$patch(emptyState())
      this.authReady = true
    },

    async reset() {
      if (!this.userId || !isSupabaseConfigured) return

      await supabase.from('level_progress').delete().eq('user_id', this.userId)
      await supabase.from('achievements').delete().eq('user_id', this.userId)
      await supabase.from('projects').delete().eq('user_id', this.userId)

      this.completedLevels = []
      this.scores = {}
      this.projects = []
      await this.loadPublicProjects()
    }
  }
})
