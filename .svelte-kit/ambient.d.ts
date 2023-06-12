
// this file is generated — do not edit it


/// <reference types="@sveltejs/kit" />

/**
 * Environment variables [loaded by Vite](https://vitejs.dev/guide/env-and-mode.html#env-files) from `.env` files and `process.env`. Like [`$env/dynamic/private`](https://kit.svelte.dev/docs/modules#$env-dynamic-private), this module cannot be imported into client-side code. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env).
 * 
 * _Unlike_ [`$env/dynamic/private`](https://kit.svelte.dev/docs/modules#$env-dynamic-private), the values exported from this module are statically injected into your bundle at build time, enabling optimisations like dead code elimination.
 * 
 * ```ts
 * import { API_KEY } from '$env/static/private';
 * ```
 * 
 * Note that all environment variables referenced in your code should be declared (for example in an `.env` file), even if they don't have a value until the app is deployed:
 * 
 * ```
 * MY_FEATURE_FLAG=""
 * ```
 * 
 * You can override `.env` values from the command line like so:
 * 
 * ```bash
 * MY_FEATURE_FLAG="enabled" npm run dev
 * ```
 */
declare module '$env/static/private' {
	export const npm_lib: string;
	export const LANGUAGE: string;
	export const local_scripts: string;
	export const USER: string;
	export const CVS_RSH: string;
	export const LC_TIME: string;
	export const npm_config_user_agent: string;
	export const STARSHIP_SHELL: string;
	export const npm_bin: string;
	export const PSTILL_PATH: string;
	export const ENSCRIPT: string;
	export const XDG_SESSION_TYPE: string;
	export const TAPE: string;
	export const npm_node_execpath: string;
	export const local_lib: string;
	export const SHLVL: string;
	export const npm_config_noproxy: string;
	export const HOME: string;
	export const OLDPWD: string;
	export const DESKTOP_SESSION: string;
	export const local_bin: string;
	export const NVM_BIN: string;
	export const npm_package_json: string;
	export const NVM_INC: string;
	export const GNOME_SHELL_SESSION_MODE: string;
	export const GTK_MODULES: string;
	export const LC_MONETARY: string;
	export const npm_config_userconfig: string;
	export const npm_config_local_prefix: string;
	export const SYSTEMD_EXEC_PID: string;
	export const NNTPSERVER: string;
	export const bashrc_read: string;
	export const DBUS_SESSION_BUS_ADDRESS: string;
	export const SAL_IGNOREXERRORS: string;
	export const COLORTERM: string;
	export const COLOR: string;
	export const NVM_DIR: string;
	export const npm_config_metrics_registry: string;
	export const IM_CONFIG_PHASE: string;
	export const GTK_IM_MODULE: string;
	export const LOGNAME: string;
	export const lab_scripts: string;
	export const _: string;
	export const npm_config_prefix: string;
	export const self_scripts: string;
	export const XDG_SESSION_CLASS: string;
	export const USERNAME: string;
	export const TERM: string;
	export const npm_config_cache: string;
	export const GNOME_DESKTOP_SESSION_ID: string;
	export const lab_lib: string;
	export const GTK2_MODULES: string;
	export const WINDOWPATH: string;
	export const GTK2_RC_FILES: string;
	export const self_lib: string;
	export const npm_config_node_gyp: string;
	export const PATH: string;
	export const SESSION_MANAGER: string;
	export const java_scripts: string;
	export const lab_bin: string;
	export const FLASH_GTK_LIBRARY: string;
	export const PAPERSIZE: string;
	export const NODE: string;
	export const npm_package_name: string;
	export const XDG_MENU_PREFIX: string;
	export const LC_ADDRESS: string;
	export const python_scripts: string;
	export const GNOME_TERMINAL_SCREEN: string;
	export const OOO_FORCE_DESKTOP: string;
	export const self_bin: string;
	export const XDG_RUNTIME_DIR: string;
	export const ZEITGEIST_DATA_PATH: string;
	export const DISPLAY: string;
	export const SDKEYDIR: string;
	export const LANG: string;
	export const XDG_CURRENT_DESKTOP: string;
	export const java_lib: string;
	export const LC_TELEPHONE: string;
	export const XMODIFIERS: string;
	export const XDG_SESSION_DESKTOP: string;
	export const XAUTHORITY: string;
	export const GNOME_TERMINAL_SERVICE: string;
	export const python_lib: string;
	export const npm_lifecycle_script: string;
	export const SSH_AGENT_LAUNCHER: string;
	export const java_bin: string;
	export const SSH_AUTH_SOCK: string;
	export const SHELL: string;
	export const LC_NAME: string;
	export const FONT: string;
	export const python_bin: string;
	export const npm_package_version: string;
	export const npm_lifecycle_event: string;
	export const QT_ACCESSIBILITY: string;
	export const GDMSESSION: string;
	export const LC_MEASUREMENT: string;
	export const GPG_AGENT_INFO: string;
	export const LC_IDENTIFICATION: string;
	export const CLASSPATH: string;
	export const QT_IM_MODULE: string;
	export const npm_config_globalconfig: string;
	export const npm_config_init_module: string;
	export const CVSROOT: string;
	export const PWD: string;
	export const npm_execpath: string;
	export const XDG_CONFIG_DIRS: string;
	export const PRINTER: string;
	export const NVM_CD_FLAGS: string;
	export const XDG_DATA_DIRS: string;
	export const npm_config_global_prefix: string;
	export const STARSHIP_SESSION_KEY: string;
	export const PYTHONPATH: string;
	export const LC_NUMERIC: string;
	export const npm_command: string;
	export const LC_PAPER: string;
	export const ORGANIZATION: string;
	export const VTE_VERSION: string;
	export const npm_scripts: string;
	export const NVM_RC_VERSION: string;
	export const REPLYTO: string;
	export const INIT_CWD: string;
	export const EDITOR: string;
	export const NODE_ENV: string;
}

/**
 * Similar to [`$env/static/private`](https://kit.svelte.dev/docs/modules#$env-static-private), except that it only includes environment variables that begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Values are replaced statically at build time.
 * 
 * ```ts
 * import { PUBLIC_BASE_URL } from '$env/static/public';
 * ```
 */
declare module '$env/static/public' {
	export const PUBLIC_API_URL: string;
	export const PUBLIC_USERS_URL: string;
	export const PUBLIC_AUTH_URL: string;
}

/**
 * This module provides access to runtime environment variables, as defined by the platform you're running on. For example if you're using [`adapter-node`](https://github.com/sveltejs/kit/tree/master/packages/adapter-node) (or running [`vite preview`](https://kit.svelte.dev/docs/cli)), this is equivalent to `process.env`. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env).
 * 
 * This module cannot be imported into client-side code.
 * 
 * ```ts
 * import { env } from '$env/dynamic/private';
 * console.log(env.DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 * 
 * > In `dev`, `$env/dynamic` always includes environment variables from `.env`. In `prod`, this behavior will depend on your adapter.
 */
declare module '$env/dynamic/private' {
	export const env: {
		npm_lib: string;
		LANGUAGE: string;
		local_scripts: string;
		USER: string;
		CVS_RSH: string;
		LC_TIME: string;
		npm_config_user_agent: string;
		STARSHIP_SHELL: string;
		npm_bin: string;
		PSTILL_PATH: string;
		ENSCRIPT: string;
		XDG_SESSION_TYPE: string;
		TAPE: string;
		npm_node_execpath: string;
		local_lib: string;
		SHLVL: string;
		npm_config_noproxy: string;
		HOME: string;
		OLDPWD: string;
		DESKTOP_SESSION: string;
		local_bin: string;
		NVM_BIN: string;
		npm_package_json: string;
		NVM_INC: string;
		GNOME_SHELL_SESSION_MODE: string;
		GTK_MODULES: string;
		LC_MONETARY: string;
		npm_config_userconfig: string;
		npm_config_local_prefix: string;
		SYSTEMD_EXEC_PID: string;
		NNTPSERVER: string;
		bashrc_read: string;
		DBUS_SESSION_BUS_ADDRESS: string;
		SAL_IGNOREXERRORS: string;
		COLORTERM: string;
		COLOR: string;
		NVM_DIR: string;
		npm_config_metrics_registry: string;
		IM_CONFIG_PHASE: string;
		GTK_IM_MODULE: string;
		LOGNAME: string;
		lab_scripts: string;
		_: string;
		npm_config_prefix: string;
		self_scripts: string;
		XDG_SESSION_CLASS: string;
		USERNAME: string;
		TERM: string;
		npm_config_cache: string;
		GNOME_DESKTOP_SESSION_ID: string;
		lab_lib: string;
		GTK2_MODULES: string;
		WINDOWPATH: string;
		GTK2_RC_FILES: string;
		self_lib: string;
		npm_config_node_gyp: string;
		PATH: string;
		SESSION_MANAGER: string;
		java_scripts: string;
		lab_bin: string;
		FLASH_GTK_LIBRARY: string;
		PAPERSIZE: string;
		NODE: string;
		npm_package_name: string;
		XDG_MENU_PREFIX: string;
		LC_ADDRESS: string;
		python_scripts: string;
		GNOME_TERMINAL_SCREEN: string;
		OOO_FORCE_DESKTOP: string;
		self_bin: string;
		XDG_RUNTIME_DIR: string;
		ZEITGEIST_DATA_PATH: string;
		DISPLAY: string;
		SDKEYDIR: string;
		LANG: string;
		XDG_CURRENT_DESKTOP: string;
		java_lib: string;
		LC_TELEPHONE: string;
		XMODIFIERS: string;
		XDG_SESSION_DESKTOP: string;
		XAUTHORITY: string;
		GNOME_TERMINAL_SERVICE: string;
		python_lib: string;
		npm_lifecycle_script: string;
		SSH_AGENT_LAUNCHER: string;
		java_bin: string;
		SSH_AUTH_SOCK: string;
		SHELL: string;
		LC_NAME: string;
		FONT: string;
		python_bin: string;
		npm_package_version: string;
		npm_lifecycle_event: string;
		QT_ACCESSIBILITY: string;
		GDMSESSION: string;
		LC_MEASUREMENT: string;
		GPG_AGENT_INFO: string;
		LC_IDENTIFICATION: string;
		CLASSPATH: string;
		QT_IM_MODULE: string;
		npm_config_globalconfig: string;
		npm_config_init_module: string;
		CVSROOT: string;
		PWD: string;
		npm_execpath: string;
		XDG_CONFIG_DIRS: string;
		PRINTER: string;
		NVM_CD_FLAGS: string;
		XDG_DATA_DIRS: string;
		npm_config_global_prefix: string;
		STARSHIP_SESSION_KEY: string;
		PYTHONPATH: string;
		LC_NUMERIC: string;
		npm_command: string;
		LC_PAPER: string;
		ORGANIZATION: string;
		VTE_VERSION: string;
		npm_scripts: string;
		NVM_RC_VERSION: string;
		REPLYTO: string;
		INIT_CWD: string;
		EDITOR: string;
		NODE_ENV: string;
		[key: `PUBLIC_${string}`]: undefined;
		[key: string]: string | undefined;
	}
}

/**
 * Similar to [`$env/dynamic/private`](https://kit.svelte.dev/docs/modules#$env-dynamic-private), but only includes variables that begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Note that public dynamic environment variables must all be sent from the server to the client, causing larger network requests — when possible, use `$env/static/public` instead.
 * 
 * ```ts
 * import { env } from '$env/dynamic/public';
 * console.log(env.PUBLIC_DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 */
declare module '$env/dynamic/public' {
	export const env: {
		PUBLIC_API_URL: string;
		PUBLIC_USERS_URL: string;
		PUBLIC_AUTH_URL: string;
		[key: `PUBLIC_${string}`]: string | undefined;
	}
}
