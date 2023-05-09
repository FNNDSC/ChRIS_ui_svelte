import { Link, useSearchParams, useActionData } from "@remix-run/react";
import { redirect, json } from "@remix-run/node";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { badRequest, verifyLogin } from "~/utils/request.server";
import { createUserSession, getToken } from "~/utils/session.server";

export async function loader({ request }: LoaderArgs) {
  const token = await getToken(request);
  if (token) return redirect("/");
  return json({});
}

export const action = async ({ request }: ActionArgs) => {
  const form = await request.formData();
  const username = form.get("username");
  const password = form.get("password");
  // const redirectTo = (form.get("redirectTo") as string) || "/";

  if (typeof password !== "string" || typeof username !== "string") {
    return badRequest({
      fieldErrors: null,
      fields: null,
      formError: "Form not submitted correctly.",
    });
  }

  const fields = { password, username };
  const fieldErrors = {
    password: password.length === 0 && "Password must not be empty",
    username: username.length === 0 && "Username must not be empty",
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({
      fieldErrors,
      fields,
      formError: null,
    });
  }

  try {
    const token = await verifyLogin(username, password);
    if (!token) {
      return badRequest({
        fieldErrors: null,
        fields,
        formError: "Incorrect username or password",
      });
    }
    return createUserSession({
      request,
      token: token,
    });
  } catch (error: any) {
    const errorMessage = error.response ? error.response.data : error.message;
    return badRequest({
      fieldErrors: null,
      fields,
      formError: errorMessage,
    });
  }
};

export default function Login() {
  const actionData = useActionData();
  const [searchParams] = useSearchParams();
  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-10 w-auto"
            src="https://user-images.githubusercontent.com/15992276/236964461-da103b84-56e5-47ef-baec-51092602faf1.png"
            alt="Your Company"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" method="POST">
            <input
              type="hidden"
              name="redirectTo"
              value={searchParams.get("redirectTo") ?? undefined}
            />
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium leading-6 text-white"
              >
                Username
              </label>
              <div className="mt-2">
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  aria-invalid={Boolean(actionData?.fieldErrors?.username)}
                  aria-errormessage={
                    actionData?.fieldErrors?.username
                      ? "username-error"
                      : undefined
                  }
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-white"
                >
                  Password
                </label>
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-semibold text-indigo-400 hover:text-indigo-300"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              {actionData?.formError ? (
                <p className="form-validation-error text-red-600" role="alert">
                  {actionData.formError}
                </p>
              ) : null}
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                Sign in
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-400">
            Not a member?{" "}
            <a
              href="#"
              className="font-semibold leading-6 text-indigo-400 hover:text-indigo-300"
            >
              Register
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
