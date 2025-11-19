import {
  IAuthenticateGeneric,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class DiscordSelfApi implements ICredentialType {
  name = 'discordSelfApi';
  displayName = 'Discord Self-Bot API';
  documentationUrl = 'https://docs.n8n.io/credentials/discord';
  properties: INodeProperties[] = [
    {
      displayName: 'User Token',
      name: 'token',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      required: true,
      description: 'Discord user account token. WARNING: Self-bots violate Discord ToS.',
      placeholder: 'Your Discord user token',
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      headers: {
        Authorization: '={{$credentials.token}}',
      },
    },
  };
}
