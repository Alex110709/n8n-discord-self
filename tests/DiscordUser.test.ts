import { DiscordUser } from '../src/nodes/DiscordUser/DiscordUser.node';

describe('DiscordUser', () => {
  let discordUser: DiscordUser;

  beforeEach(() => {
    discordUser = new DiscordUser();
  });

  it('should be defined', () => {
    expect(discordUser).toBeDefined();
  });

  it('should have correct node description', () => {
    expect(discordUser.description.displayName).toBe('Discord User');
    expect(discordUser.description.name).toBe('discordUser');
  });

  it('should have resource selector', () => {
    const resourceProp = discordUser.description.properties.find(
      (prop) => prop.name === 'resource'
    );
    
    expect(resourceProp).toBeDefined();
    if (resourceProp && 'options' in resourceProp) {
      const resourceValues = resourceProp.options?.map((op: any) => op.value);
      expect(resourceValues).toContain('message');
      expect(resourceValues).toContain('userProfile');
      expect(resourceValues).toContain('server');
      expect(resourceValues).toContain('channel');
      expect(resourceValues).toContain('role');
      expect(resourceValues).toContain('member');
      expect(resourceValues).toContain('presence');
      expect(resourceValues).toContain('invite');
    }
  });

  it('should require credentials', () => {
    expect(discordUser.description.credentials).toHaveLength(1);
    expect(discordUser.description.credentials![0].name).toBe('discordSelfApi');
    expect(discordUser.description.credentials![0].required).toBe(true);
  });
});
