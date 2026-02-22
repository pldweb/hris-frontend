export default [
    {
        path: 'roles',
        name: 'admin.roles',
        component: () => import('@/views/admin/role/RoleList.vue')
    },
    {
        path: 'roles/create',
        name: 'admin.roles.create',
        component: () => import('@/views/admin/role/RoleForm.vue')
    },
    {
        path: 'roles/:id/edit',
        name: 'admin.roles.edit',
        component: () => import('@/views/admin/role/RoleForm.vue')
    }
];
