import { createRouter, createWebHistory } from 'vue-router'

import RegisterView from '../views/RegisterView.vue'
import LoginView from '../views/LoginView.vue'
import LevelsView from '../views/LevelsView.vue'
import LevelView from '../views/LevelView.vue'
import LibraryView from '../views/LibraryView.vue'
import ProfileView from '../views/ProfileView.vue'
import ProjectView from '../views/ProjectView.vue'
import GalleryView from '../views/GalleryView.vue'
import CertificateView from '../views/CertificateView.vue'

const routes = [
  { path: '/', redirect: '/register' },
  { path: '/register', component: RegisterView },
  { path: '/login', component: LoginView },
  { path: '/levels', component: LevelsView },
  { path: '/levels/:id', component: LevelView },
  { path: '/library', component: LibraryView },
  { path: '/profile', component: ProfileView },
  { path: '/project', component: ProjectView },
  { path: '/gallery', component: GalleryView },
  { path: '/certificate', component: CertificateView }
]

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})
