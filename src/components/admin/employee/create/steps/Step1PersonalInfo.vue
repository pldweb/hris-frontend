<script setup lang="ts">
import { Input, TextArea } from "@/components/common/form";
import {
  User,
  Mail,
  Lock,
  Phone,
  Calendar,
  Heart,
  MapPin,
  Hash,
  Building2,
  Camera,
  FolderOpen,
  X,
} from "lucide-vue-next";
import { ref, computed } from "vue";

interface Props {
  modelValue: any;
  errors?: any;
}

const props = defineProps<Props>();
const emit = defineEmits(["update:modelValue"]);

const form = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

// Profile photo handling
const profilePhotoInput = ref<HTMLInputElement | null>(null);

const handlePhotoSelect = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];

  if (file) {
    form.value.profile_photo = file;
    form.value.profile_photo_url = URL.createObjectURL(file);
  }
};

const deletePhoto = () => {
  form.value.profile_photo = null;
  form.value.profile_photo_url = "";
  if (profilePhotoInput.value) {
    profilePhotoInput.value.value = "";
  }
};

</script>

<template>
  <div class="flex gap-6 items-start">
    <!-- Profile Photo Card -->
    <div class="w-80">
      <div class="bg-white border border-[#DCDEDD] rounded-[20px] p-6">
        <div class="flex items-center gap-3 mb-6">
          <div
            class="w-12 h-12 bg-purple-50 rounded-[12px] flex items-center justify-center"
          >
            <Camera class="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 class="text-brand-dark text-xl font-bold">Foto Profil</h3>
            <p class="text-brand-light text-sm font-normal">Unggah foto pegawai</p>
          </div>
        </div>

        <div class="flex flex-col items-center">
          <!-- Photo Placeholder -->
          <div
            v-if="!form.profile_photo_url"
            class="w-48 h-48 bg-gray-100 border-2 border-dashed border-[#DCDEDD] rounded-full flex items-center justify-center mb-4"
          >
            <Camera class="w-16 h-16 text-gray-400" />
          </div>

          <!-- Selected Photo Container -->
          <div v-else class="mb-4">
            <div class="relative w-48 h-48">
              <img
                :src="form.profile_photo_url"
                alt="Profile"
                class="w-48 h-48 rounded-full object-cover border-2 border-[#DCDEDD]"
              />
              <button
                type="button"
                @click="deletePhoto"
                class="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors flex items-center justify-center"
              >
                <X class="w-4 h-4" />
              </button>
            </div>
          </div>

          <div class="flex flex-col gap-3 items-center">
            <input
              type="file"
              accept="image/*"
              class="hidden"
              ref="profilePhotoInput"
              @change="handlePhotoSelect"
            />
            <button
              type="button"
              @click="profilePhotoInput?.click()"
              class="border border-[#DCDEDD] rounded-[8px] hover:border-[#0C51D9] hover:border-2 hover:bg-gray-50 transition-all duration-300 px-6 py-3 flex items-center gap-2"
            >
              <FolderOpen class="w-4 h-4 text-gray-600" />
              <span class="text-brand-dark text-base font-semibold">Cari Foto</span>
            </button>
            <p class="text-brand-light text-xs text-center">
              JPG, PNG hingga 2MB<br />Disarankan: 400x400px
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Form Section -->
    <div class="flex-1">
      <!-- Account Credentials Section -->
      <div class="bg-white border border-[#DCDEDD] rounded-[20px] p-6 mb-6">
        <div class="flex items-center gap-3 mb-6">
          <div
            class="w-12 h-12 bg-purple-50 rounded-[12px] flex items-center justify-center"
          >
            <Lock class="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 class="text-brand-dark text-xl font-bold">Kredensial Akun</h3>
            <p class="text-brand-light text-sm font-normal">
              Informasi login dan detail akun
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div class="mb-4">
            <Input
              id="name"
              name="name"
              type="text"
              v-model="form.name"
              label="Nama Lengkap *"
              placeholder="Masukkan nama lengkap"
              :error="errors?.name?.join(', ')"
              required
            >
              <template #icon>
                <User class="h-5 w-5 text-gray-400" />
              </template>
            </Input>
          </div>

          <div class="mb-4">
            <Input
              id="email"
              name="email"
              type="email"
              v-model="form.email"
              label="Alamat Email *"
              placeholder="employee@company.com"
              :error="errors?.email?.join(', ')"
              required
            >
              <template #icon>
                <Mail class="h-5 w-5 text-gray-400" />
              </template>
            </Input>
          </div>

          <div class="mb-4">
            <Input
              id="password"
              name="password"
              type="password"
              v-model="form.password"
              label="Kata Sandi *"
              placeholder="Masukkan kata sandi (min. 8 karakter)"
              :error="errors?.password?.join(', ')"
              required
            >
              <template #icon>
                <Lock class="h-5 w-5 text-gray-400" />
              </template>
            </Input>
          </div>

          <div class="mb-4">
            <Input
              id="password_confirmation"
              name="password_confirmation"
              type="password"
              v-model="form.password_confirmation"
              label="Konfirmasi Kata Sandi *"
              placeholder="Konfirmasi kata sandi"
              :error="errors?.password_confirmation?.join(', ')"
              required
            >
              <template #icon>
                <Lock class="h-5 w-5 text-gray-400" />
              </template>
            </Input>
          </div>

          <div class="mb-4 md:col-span-2">
            <Input
              id="identity_number"
              name="identity_number"
              type="text"
              v-model="form.identity_number"
              label="Nomor Identitas (NIK/KTP) *"
              placeholder="Masukkan nomor identitas"
              :error="errors?.identity_number?.join(', ')"
              required
            >
              <template #icon>
                <Hash class="h-5 w-5 text-gray-400" />
              </template>
            </Input>
          </div>
        </div>
      </div>

      <!-- Personal Information Section -->
      <div class="bg-white border border-[#DCDEDD] rounded-[20px] p-6">
        <div class="flex items-center gap-3 mb-6">
          <div
            class="w-12 h-12 bg-blue-50 rounded-[12px] flex items-center justify-center"
          >
            <User class="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 class="text-brand-dark text-xl font-bold">Informasi Pribadi</h3>
            <p class="text-brand-light text-sm font-normal">
              Detail dasar pegawai dan informasi kontak
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div class="mb-4">
            <Input
              id="phone"
              name="phone"
              type="tel"
              v-model="form.phone"
              label="Nomor Telepon *"
              placeholder="+1 (555) 123-4567"
              :error="errors?.phone?.join(', ')"
            >
              <template #icon>
                <Phone class="h-5 w-5 text-gray-400" />
              </template>
            </Input>
          </div>

          <div class="mb-4">
            <Input
              id="date_of_birth"
              name="date_of_birth"
              type="date"
              v-model="form.date_of_birth"
              label="Tanggal Lahir *"
              :error="errors?.date_of_birth?.join(', ')"
            >
              <template #icon>
                <Calendar class="h-5 w-5 text-gray-400" />
              </template>
            </Input>
          </div>

          <div class="mb-4">
            <Input
              id="hobby"
              name="hobby"
              type="text"
              v-model="form.hobby"
              label="Hobi"
              placeholder="misal: Membaca, Berenang, Bermain Game"
              :error="errors?.hobby?.join(', ')"
            >
              <template #icon>
                <Heart class="h-5 w-5 text-gray-400" />
              </template>
            </Input>
          </div>

          <div class="mb-4">
            <Input
              id="place_of_birth"
              name="place_of_birth"
              type="text"
              v-model="form.place_of_birth"
              label="Tempat Lahir *"
              placeholder="misal: Jakarta, Indonesia"
              :error="errors?.place_of_birth?.join(', ')"
            >
              <template #icon>
                <MapPin class="h-5 w-5 text-gray-400" />
              </template>
            </Input>
          </div>

          <!-- Gender (Full Width) -->
          <div class="md:col-span-2 mb-4">
            <label class="block text-brand-dark text-base font-semibold mb-1">Jenis Kelamin *</label>
            <div class="flex gap-4">
              <!-- Male Option -->
              <label
                class="group card flex items-center justify-between w-full min-h-[60px] rounded-[16px] border border-[#DCDEDD] p-4 has-[:checked]:ring-2 has-[:checked]:ring-[#0C51D9] has-[:checked]:ring-offset-2 transition-all duration-300 cursor-pointer"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 bg-blue-50 rounded-[12px] flex items-center justify-center"
                  >
                    <User class="w-5 h-5 text-blue-600" />
                  </div>
                  <div class="flex flex-col">
                    <p class="text-brand-dark text-base font-semibold">Laki-laki</p>
                  </div>
                </div>
                <div
                  class="relative flex items-center justify-center w-fit h-8 shrink-0 rounded-xl border border-[#DCDEDD] py-2 px-3 gap-2"
                >
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    class="hidden"
                    v-model="form.gender"
                  />
                  <div
                    class="flex size-[18px] rounded-full shadow-sm border border-[#DCDEDD] group-has-[:checked]:border-[5px] group-has-[:checked]:border-[#0C51D9] transition-all duration-300"
                  ></div>
                  <p
                    class="text-xs font-semibold after:content-['Pilih'] group-has-[:checked]:after:content-['Dipilih']"
                  ></p>
                </div>
              </label>

              <!-- Female Option -->
              <label
                class="group card flex items-center justify-between w-full min-h-[60px] rounded-[16px] border border-[#DCDEDD] p-4 has-[:checked]:ring-2 has-[:checked]:ring-[#0C51D9] has-[:checked]:ring-offset-2 transition-all duration-300 cursor-pointer"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 bg-pink-50 rounded-[12px] flex items-center justify-center"
                  >
                    <User class="w-5 h-5 text-pink-600" />
                  </div>
                  <div class="flex flex-col">
                    <p class="text-brand-dark text-base font-semibold">Perempuan</p>
                  </div>
                </div>
                <div
                  class="relative flex items-center justify-center w-fit h-8 shrink-0 rounded-xl border border-[#DCDEDD] py-2 px-3 gap-2"
                >
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    class="hidden"
                    v-model="form.gender"
                  />
                  <div
                    class="flex size-[18px] rounded-full shadow-sm border border-[#DCDEDD] group-has-[:checked]:border-[5px] group-has-[:checked]:border-[#0C51D9] transition-all duration-300"
                  ></div>
                  <p
                    class="text-xs font-semibold after:content-['Pilih'] group-has-[:checked]:after:content-['Dipilih']"
                  ></p>
                </div>
              </label>
            </div>
          </div>

          <!-- Address -->
          <div class="mb-4">
            <TextArea
              id="address"
              name="address"
              v-model="form.address"
              label="Alamat *"
              placeholder="Masukkan alamat lengkap"
              :error="errors?.address?.join(', ')"
              rows="5"
            >
              <template #icon>
                <MapPin class="h-5 w-5 text-gray-400" />
              </template>
            </TextArea>
          </div>

          <!-- City and Post Code -->
          <div class="mb-4">
            <!-- City -->
            <div class="mb-4">
              <Input
                id="city"
                name="city"
                type="text"
                v-model="form.city"
                label="Kota *"
                placeholder="misal: Jakarta"
                :error="errors?.city?.join(', ')"
                required
              >
                <template #icon>
                  <Building2 class="h-5 w-5 text-gray-400" />
                </template>
              </Input>
            </div>

            <!-- Postal Code -->
            <div class="mb-4">
              <Input
                id="postal_code"
                name="postal_code"
                type="text"
                v-model="form.postal_code"
                label="Kode Pos *"
                placeholder="e.g. 12345"
                :error="errors?.postal_code?.join(', ')"
                required
              >
                <template #icon>
                  <Hash class="h-5 w-5 text-gray-400" />
                </template>
              </Input>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
