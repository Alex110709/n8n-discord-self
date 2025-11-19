import { DiscordSelfV2 } from '../src/nodes/DiscordSelf/DiscordSelfV2.node';

describe('DiscordSelfV2', () => {
  let discordSelfV2: DiscordSelfV2;

  beforeEach(() => {
    discordSelfV2 = new DiscordSelfV2();
  });

  it('should be defined', () => {
    expect(discordSelfV2).toBeDefined();
  });

  it('should have correct node description', () => {
    expect(discordSelfV2.description.displayName).toBe('Discord Self-Bot V2');
    expect(discordSelfV2.description.name).toBe('discordSelfV2');
    expect(discordSelfV2.description.version).toBe(1);
  });

  it('should have resource selector', () => {
    const resourceProp = discordSelfV2.description.properties.find(
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
    expect(discordSelfV2.description.credentials).toHaveLength(1);
    expect(discordSelfV2.description.credentials![0].name).toBe('discordSelfApi');
    expect(discordSelfV2.description.credentials![0].required).toBe(true);
  });

  it('should have all message operations', () => {
    const operations = discordSelfV2.description.properties.filter(
      (prop) => prop.name === 'operation' && prop.displayOptions?.show?.resource?.[0] === 'message'
    );
    
    expect(operations.length).toBeGreaterThan(0);
  });
});
