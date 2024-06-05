
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    redirect: { name: 'contatos' },
    children: [
      { path: '', component: () => import('pages/contatos/Index.vue'), meta: { requiresAuth: true } },
      { path: '/home', name: 'home-dashboard', component: () => import('pages/dashboard/Index.vue') },
      { path: '/painel-atendimentos', name: 'painel-atendimentos', component: () => import('pages/dashboard/DashTicketsFilas.vue'), meta: { requiresAuth: true } },
      // { path: '/ConsultarTicketsQueuesService', name: 'dashboard', component: () => import('pages/dashboard/Index.vue') },
      { path: '/sessoes', name: 'sessoes', component: () => import('pages/sessaoWhatsapp/Index.vue'), meta: { requiresAuth: true } },
      { path: '/templates', name: 'templates', component: () => import('pages/templatesCard/Index.vue'), meta: { requiresAuth: true } },
      { path: '/contatos', name: 'contatos', component: () => import('pages/contatos/Index.vue') },
      { path: '/empresas', name: 'empresas', component: () => import('pages/empresas/Index.vue'), meta: { requiresAuth: true } },
      { path: '/usuarios', name: 'usuarios', component: () => import('pages/usuarios/Index.vue'), meta: { requiresAuth: true } },
      { path: '/auto-resposta', name: 'auto-resposta', component: () => import('pages/fluxoAutoResposta/Index.vue'), meta: { requiresAuth: true } },
      { path: '/mensagens-rapidas', name: 'mensagens-rapidas', component: () => import('pages/mensagensRapidas/Index.vue'), meta: { requiresAuth: true } },
      { path: '/filas', name: 'filas', component: () => import('pages/filas/Index.vue'), meta: { requiresAuth: true } },
      { path: '/configuracoes', name: 'configuracoes', component: () => import('pages/configuracoes/Index.vue'), meta: { requiresAuth: true } },
      { path: '/etiquetas', name: 'etiquetas', component: () => import('pages/etiquetas/Index.vue'), meta: { requiresAuth: true } },
      { path: '/campanhas', name: 'campanhas', component: () => import('pages/campanhas/Index.vue'), meta: { requiresAuth: true } },
      { path: '/campanhas/:campanhaId', name: 'contatos-campanha', component: () => import('pages/campanhas/ContatosCampanha.vue'), meta: { requiresAuth: true } },
      { path: '/horario-atendimento', name: 'horarioAtendimento', component: () => import('pages/horarioAtendimento/Index.vue'), meta: { requiresAuth: true } },
      { path: '/api-service', name: 'api-service', component: () => import('pages/api/Index.vue'), meta: { requiresAuth: true } },
      {
        path: '/chat-flow',
        component: () => import('pages/chatFlow/Index.vue'),
        redirect: 'chat-flow',
        meta: { requiresAuth: true },
        children: [
          { path: '', name: 'chat-flow', component: () => import('pages/chatFlow/ListaChatFlow.vue'), meta: { requiresAuth: true } },
          { path: 'builder', name: 'chat-flow-builder', component: () => import('components/ccFlowBuilder/panel.vue'), meta: { requiresAuth: true } }
        ]
      },
      {
        path: '/relatorios',
        name: 'relatorios',
        component: () => import('pages/relatorios/ccListaRelatorios.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'estatisticas-atendimentos-usuarios',
        name: 'estatisticas-atendimentos-usuarios',
        component: () => import('pages/relatorios/RelatorioResumoAtendimentosUsuarios'),
        meta: { requiresAuth: true }
      },
      {
        path: 'lista-contatos',
        name: 'lista-contatos',
        component: () => import('pages/relatorios/RelatorioContatosGeral'),
        meta: { requiresAuth: true }
      },
      {
        path: 'contatos-por-etiquetas',
        name: 'contatos-por-etiquetas',
        component: () => import('pages/relatorios/RelatorioContatosEtiquetas'),
        meta: { requiresAuth: true }
      },
      {
        path: 'contatos-por-estado',
        name: 'contatos-por-estado',
        component: () => import('pages/relatorios/RelatorioContatosEstado'),
        meta: { requiresAuth: true }
      },
      {
        path: '/atendimento',
        name: 'atendimento',
        // redirect: { name: 'chat-empty' },
        component: () => import('pages/atendimento/Index.vue'),
        children: [
          {
            path: '/chats/',
            name: 'chat-empty',
            component: () => import('pages/atendimento/Chat.vue')
          },
          {
            path: ':ticketId',
            name: 'chat',
            component: () => import('pages/atendimento/Chat.vue')
            // beforeEnter (to, from, next) {
            //   if (!from.params.ticketId) {
            //     next({ name: 'chat-empty' })
            //   }
            //   next()
            // }
          },
          {
            path: 'contatos',
            name: 'chat-contatos',
            component: () => import('pages/contatos/Index.vue'),
            props: { isChatContact: true }
          }
        ]
      },
      {
        path: '/chat-interno',
        name: 'chat-interno',
        component: () => import('pages/chatInterno/index.vue')
      }
    ]
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    name: '404',
    component: () => import('pages/Error404.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('pages/Login.vue')
  }
]

export default routes
