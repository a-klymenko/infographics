export const achievements = [
  { id: 'first', icon: '🌱', title: 'Перший крок', description: 'Пройти перший рівень', condition: (s) => s.completedLevels.length >= 1 },
  { id: 'three', icon: '🔥', title: 'Стабільний прогрес', description: 'Пройти 3 рівні', condition: (s) => s.completedLevels.length >= 3 },
  { id: 'five', icon: '⭐', title: 'Половина шляху', description: 'Пройти 5 рівнів', condition: (s) => s.completedLevels.length >= 5 },
  { id: 'ten', icon: '🏆', title: 'Випускник', description: 'Пройти всі 10 рівнів', condition: (s) => s.completedLevels.length >= 10 },
  { id: 'good', icon: '✅', title: 'Гарний результат', description: 'Середній бал від 70%', condition: (s) => s.averageScore >= 70 },
  { id: 'excellent', icon: '💎', title: 'Відмінник', description: 'Середній бал від 90%', condition: (s) => s.averageScore >= 90 },
  { id: 'project', icon: '🎨', title: 'Автор інфографіки', description: 'Створити підсумкову роботу', condition: (s) => s.projects.length >= 1 },
  { id: 'certificate', icon: '📜', title: 'Сертифікат отримано', description: 'Відкрити сертифікат', condition: (s) => s.canGetCertificate },
  { id: 'library', icon: '📚', title: 'Любитель конспектів', description: 'Пройти 2 рівні', condition: (s) => s.completedLevels.length >= 2 },
  { id: 'avatar', icon: '🦆', title: 'Новий образ', description: 'Змінити аватар', condition: (s) => s.avatarChanged },
  { id: 'gallery', icon: '🖼️', title: 'У галереї', description: 'Додати роботу до галереї', condition: (s) => s.projects.length >= 1 },
  { id: 'tests', icon: '🧪', title: 'Тестувальник', description: 'Пройти 4 тести', condition: (s) => Object.keys(s.scores).length >= 4 },
  { id: 'color', icon: '🎨', title: 'Колорист', description: 'Пройти рівень про колір', condition: (s) => s.completedLevels.includes(4) },
  { id: 'type', icon: '🔤', title: 'Типограф', description: 'Пройти рівень про типографіку', condition: (s) => s.completedLevels.includes(3) },
  { id: 'data', icon: '📊', title: 'Аналітик даних', description: 'Пройти рівень про дані', condition: (s) => s.completedLevels.includes(7) }
]
