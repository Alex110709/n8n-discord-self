import { DiscordSelfTrigger } from '../src/nodes/DiscordSelfTrigger/DiscordSelfTrigger.node';

describe('DiscordSelfTrigger', () => {
  let discordTrigger: DiscordSelfTrigger;

  beforeEach(() => {
    discordTrigger = new DiscordSelfTrigger();
  });

  it('should be defined', () => {
    expect(discordTrigger).toBeDefined();
  });

  it('should have correct node description', () => {
    expect(discordTrigger.description.displayName).toBe('Discord User Trigger');
    expect(discordTrigger.description.name).toBe('discordUserTrigger');
    expect(discordTrigger.description.group).toContain('trigger');
  });

  it('should have all event types', () => {
    const eventProp = discordTrigger.description.properties.find(
      (prop) => prop.name === 'event'
    );
    
    expect(eventProp).toBeDefined();
    if (eventProp && 'options' in eventProp) {
      const eventValues = eventProp.options?.map((op: any) => op.value);
      expect(eventValues).toContain('messageCreate');
      expect(eventValues).toContain('messageUpdate');
      expect(eventValues).toContain('messageDelete');
      expect(eventValues).toContain('messageReactionAdd');
      expect(eventValues).toContain('messageReactionRemove');
      expect(eventValues).toContain('guildMemberAdd');
      expect(eventValues).toContain('guildMemberRemove');
      expect(eventValues).toContain('guildMemberUpdate');
      expect(eventValues).toContain('presenceUpdate');
      expect(eventValues).toContain('typingStart');
    }
  });

  it('should require credentials', () => {
    expect(discordTrigger.description.credentials).toHaveLength(1);
    expect(discordTrigger.description.credentials![0].name).toBe('discordSelfApi');
    expect(discordTrigger.description.credentials![0].required).toBe(true);
  });

  it('should have filter options', () => {
    const filtersProp = discordTrigger.description.properties.find(
      (prop) => prop.name === 'filters'
    );
    
    expect(filtersProp).toBeDefined();
    expect(filtersProp?.type).toBe('collection');
  });

  it('should be a trigger node with no inputs', () => {
    expect(discordTrigger.description.inputs).toEqual([]);
    expect(discordTrigger.description.outputs).toEqual(['main']);
  });
});
