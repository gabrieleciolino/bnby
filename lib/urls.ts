export const urls = {
  root: "/",
  auth: {
    login: "/auth/login",
    register: "/auth/register",
  },
  dashboard: {
    index: "/dashboard",
    property: {
      add: "/dashboard/property/add",
      view: (id: string) => `/dashboard/property/${id}`,
    },
  },
  admin: {
    index: "/admin",
    property: {
      add: "/admin/property/add",
      view: (id: string) => `/admin/property/${id}`,
    },
  },
};
