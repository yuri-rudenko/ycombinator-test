import ky from "ky";

export const api = ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_API_URL,
  timeout: 15000,
  hooks: {
    beforeError: [
      async (error) => {
        const { response } = error;
        if (response && response.body) {
          try {
            const data = (await response.json()) as { message?: string };
            if (data.message) {
              error.name = "ApiError";
              error.message = Array.isArray(data.message)
                ? data.message.join(", ")
                : data.message;
            }
          } catch {}
        }
        return error;
      },
    ],
  },
});
