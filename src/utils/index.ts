import Client from '@fnndsc/chrisapi';

export const fetchClient = (token: string) => {
	const client = new Client('http://localhost:8000/api/v1/', {
		token
	});
	return client;
};