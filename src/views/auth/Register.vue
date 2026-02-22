<script setup>
import { useAuthStore } from "@/stores/auth";
import { ref } from "vue";
import Alert from "@/components/common/Alert.vue";
import Input from "@/components/common/form/Input.vue";
import { AtSign, BuildingIcon, Lock, UserIcon } from "lucide-vue-next";
import { storeToRefs } from "pinia";
import { RouterLink } from "vue-router";

const authStore = useAuthStore();
const { loading, error } = storeToRefs(authStore);
const { register } = authStore;

const form = ref({
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
});

const handleSubmit = async () => {
  await register(form.value);
};
</script>

<template>
  <div class="w-full lg:w-1/2 flex items-center justify-center p-5">
    <div class="w-full max-w-md space-y-8">
      <!-- Logo/Brand -->
      <div class="flex items-center gap-4">
        <div class="w-16 h-16 relative flex items-center justify-center">
          <div class="w-16 h-16 absolute bg-gradient-to-br from-primary-100 to-primary-200 rounded-full"></div>
          <div class="w-10 h-10 absolute bg-gradient-to-br from-primary-500 to-primary-600 rounded-full opacity-90"></div>
          <BuildingIcon class="w-5 h-5 text-white relative z-10" />
        </div>
        <div>
          <h1 class="text-brand-dark text-lg font-bold">SenjaHRIS</h1>
          <p class="text-brand-dark text-xs font-normal">Buat Akun Baru</p>
        </div>
      </div>

      <Alert
        type="danger"
        title="Gagal Mendaftar"
        :message="error"
        :show="!!error && typeof error === 'string'"
      />

      <!-- Register Form -->
      <form class="space-y-5" @submit.prevent="handleSubmit">
        <!-- Name Field -->
        <Input
          id="name"
          name="name"
          type="text"
          v-model="form.name"
          label="Nama Lengkap"
          placeholder="Masukkan nama lengkap"
          :required="true"
          :error="error?.name?.join(', ')"
        >
          <template #icon>
            <UserIcon class="h-5 w-5 text-gray-400" />
          </template>
        </Input>

        <!-- Email Field -->
        <Input
          id="email"
          name="email"
          type="email"
          v-model="form.email"
          label="Alamat Email"
          placeholder="Masukkan email"
          :required="true"
          :error="error?.email?.join(', ')"
        >
          <template #icon>
            <AtSign class="h-5 w-5 text-gray-400" />
          </template>
        </Input>

        <!-- Password Field -->
        <Input
          id="password"
          name="password"
          type="password"
          v-model="form.password"
          label="Kata Sandi"
          placeholder="Minimal 8 karakter"
          :required="true"
          :error="error?.password?.join(', ')"
        >
          <template #icon>
            <Lock class="h-5 w-5 text-gray-400" />
          </template>
        </Input>

        <!-- Password Confirmation Field -->
        <Input
          id="password_confirmation"
          name="password_confirmation"
          type="password"
          v-model="form.password_confirmation"
          label="Konfirmasi Kata Sandi"
          placeholder="Ulangi kata sandi"
          :required="true"
        >
          <template #icon>
            <Lock class="h-5 w-5 text-gray-400" />
          </template>
        </Input>

        <!-- Register Button -->
        <button
          type="submit"
          class="btn-primary mt-5 rounded-[8px] border border-[#2151A0] hover:brightness-110 focus:ring-2 focus:ring-[#0C51D9] transition-all duration-300 blue-gradient blue-btn-shadow px-4 py-3 flex items-center gap-2 w-full justify-center bg-gradient-to-l from-[#0c51d9] via-[#6f96e3] to-[#0c51d9] shadow-[inset_-2px_2px_1px_0_#6197ff,inset_2px_2px_1px_0_rgba(97,151,255,0.55)] text-white font-plus-jakarta-sans text-[14px] font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="loading"
        >
          {{ loading ? "Loading..." : "Daftar Sekarang" }}
        </button>
      </form>

      <!-- Back to Login Link -->
      <div class="text-center">
        <p class="text-[#6b7280] font-plus-jakarta-sans text-[14px] font-normal">
          Sudah punya akun?
          <RouterLink
            :to="{ name: 'login' }"
            class="hover:brightness-110 transition-all duration-300 text-[#3b82f6] font-plus-jakarta-sans text-[14px] font-semibold"
          >
            Masuk di sini
          </RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>
