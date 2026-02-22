import { defineStore } from "pinia";
import { axiosInstance } from '@/plugins/axios';
import { handleError } from "@/helpers/errorHelper";

export const useRoleStore = defineStore("role", {
    state: () => ({
        roles: [],
        permissions: {},
        loading: false,
        error: null,
        success: null,
    }),

    actions: {
        async fetchRoles() {
            this.loading = true;
            this.error = null;

            try {
                const response = await axiosInstance.get('roles');
                this.roles = response.data.data;
            } catch (error) {
                this.error = handleError(error);
            } finally {
                this.loading = false;
            }
        },

        async fetchPermissions() {
            this.loading = true;
            this.error = null;

            try {
                const response = await axiosInstance.get('options/permissions');
                this.permissions = response.data.data;
            } catch (error) {
                this.error = handleError(error);
            } finally {
                this.loading = false;
            }
        },

        async fetchRole(id) {
            this.loading = true;
            this.error = null;

            try {
                const response = await axiosInstance.get(`roles/${id}`);
                return response.data.data;
            } catch (error) {
                this.error = handleError(error);
            } finally {
                this.loading = false;
            }
        },

        async createRole(payload) {
            this.loading = true;
            this.error = null;
            this.success = null;

            try {
                const response = await axiosInstance.post('roles', payload);
                this.success = response.data.message;
            } catch (error) {
                this.error = handleError(error);
            } finally {
                this.loading = false;
            }
        },

        async updateRole(id, payload) {
            this.loading = true;
            this.error = null;
            this.success = null;

            try {
                const response = await axiosInstance.post(`roles/${id}`, {
                    ...payload,
                    _method: 'PUT',
                });
                this.success = response.data.message;
            } catch (error) {
                this.error = handleError(error);
            } finally {
                this.loading = false;
            }
        },

        async deleteRole(id) {
            this.loading = true;
            this.error = null;
            this.success = null;

            try {
                const response = await axiosInstance.delete(`roles/${id}`);
                this.success = response.data.message;
            } catch (error) {
                this.error = handleError(error);
            } finally {
                this.loading = false;
            }
        },
    }
});
