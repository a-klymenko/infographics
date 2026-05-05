import { defineStore } from 'pinia'
import { levels } from '../data/levels'
import { achievements } from '../data/achievements'

const saved = JSON.parse(localStorage.getItem('infographic-app-state-v2-zero') || 'null')

export const useAppStore = defineStore('app', {
  state: () => saved || ({
    registered: false,
    userName: 'Anastasiia Klymenko',
    email: 'example@gmail.com',
    password: '',
    avatar: 'avatar1',
    avatarChanged: false,
    completedLevels: [],
    scores: {},
    projects: []
  }),

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
    save() {
      localStorage.setItem('infographic-app-state-v2-zero', JSON.stringify(this.$state))
    },

    register({ name, email, password }) {
      this.userName = name
      this.email = email
      this.password = password
      this.registered = true
      this.save()
    },

    login({ email, password }) {
      if (this.email === email && this.password === password) {
        this.registered = true
        this.save()
        return true
      }

      return false
    },

    completeLevel(levelId, score) {
      if (!this.completedLevels.includes(levelId)) {
        this.completedLevels.push(levelId)
      }

      this.scores[levelId] = Math.max(this.scores[levelId] || 0, score)
      this.save()
    },

    setAvatar(avatar) {
      this.avatar = avatar
      this.avatarChanged = true
      this.save()
    },

    addProject(project) {
      this.projects.unshift({
        id: Date.now(),
        title: project.title,
        description: project.description,
        image: project.image || '',
        author: this.userName || 'Anastasiia',
        isPublic: project.isPublic
      })
      this.save()
    },

    logout() {
      this.registered = false
      this.save()
    },

    reset() {
      localStorage.removeItem('infographic-app-state-v2-zero')
      location.reload()
    }
  }
})
