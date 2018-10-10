import NewGame from '@/pages/NewGame.vue';

export const routes = [
  {
    path: '/',
    name: 'Setup',
    component: NewGame,
  },
  {
    path: '/game/:id/player/:player',
    component: () => import('@/pages/Player/Player.vue'),
  },
  {
    path: '/game/:id',
    component: () => import('@/pages/Board/Board.vue'),
  },
];
