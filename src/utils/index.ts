import Client from '@fnndsc/chrisapi';

export const fetchClient = (token: string) => {
	const client = new Client('https://cube.chrisproject.org/api/v1/', {
		token
	});
	return client;
};