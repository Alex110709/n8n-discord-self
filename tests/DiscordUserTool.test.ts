import { DiscordUserTool } from '../src/nodes/DiscordUserTool/DiscordUserTool.node';

describe('DiscordUserTool Node', () => {
  let discordUserTool: DiscordUserTool;

  beforeEach(() => {
    discordUserTool = new DiscordUserTool();
  });

  describe('Node Description', () => {
    it('should have correct display name', () => {
      expect(discordUserTool.description.displayName).toBe('Discord User Tool');
    });

    it('should have correct internal name', () => {
      expect(discordUserTool.description.name).toBe('discordUserTool');
    });

    it('should be usable as AI Agent tool', () => {
      expect(discordUserTool.description.usableAsTool).toBe(true);
    });

    it('should require discordSelfApi credentials', () => {
      expect(discordUserTool.description.credentials).toEqual([
        { name: 'discordSelfApi', required: true },
      ]);
    });

    it('should have action property', () => {
      const actionProp = discordUserTool.description.properties.find((p) => p.name === 'action');
      expect(actionProp).toBeDefined();
      expect(actionProp?.type).toBe('options');
    });

    it('should have all expected actions', () => {
      const actionProp = discordUserTool.description.properties.find((p) => p.name === 'action');
      const options = actionProp?.options as Array<{ value: string }>;
      const actionValues = options.map((o) => o.value);

      expect(actionValues).toContain('sendMessage');
      expect(actionValues).toContain('sendDM');
      expect(actionValues).toContain('readMessages');
      expect(actionValues).toContain('editMessage');
      expect(actionValues).toContain('deleteMessage');
      expect(actionValues).toContain('addReaction');
      expect(actionValues).toContain('getServerInfo');
      expect(actionValues).toContain('listServers');
      expect(actionValues).toContain('listChannels');
      expect(actionValues).toContain('listMembers');
      expect(actionValues).toContain('getUserInfo');
      expect(actionValues).toContain('searchMessages');
      expect(actionValues).toContain('setStatus');
      expect(actionValues).toContain('joinServer');
      expect(actionValues).toContain('leaveServer');
    });
  });

  describe('Node Properties', () => {
    it('should have channelId property', () => {
      const prop = discordUserTool.description.properties.find((p) => p.name === 'channelId');
      expect(prop).toBeDefined();
      expect(prop?.type).toBe('string');
    });

    it('should have userId property', () => {
      const prop = discordUserTool.description.properties.find((p) => p.name === 'userId');
      expect(prop).toBeDefined();
      expect(prop?.type).toBe('string');
    });

    it('should have content property', () => {
      const prop = discordUserTool.description.properties.find((p) => p.name === 'content');
      expect(prop).toBeDefined();
      expect(prop?.type).toBe('string');
    });

    it('should have limit property with min/max values', () => {
      const prop = discordUserTool.description.properties.find((p) => p.name === 'limit');
      expect(prop).toBeDefined();
      expect(prop?.type).toBe('number');
      expect(prop?.typeOptions?.minValue).toBe(1);
      expect(prop?.typeOptions?.maxValue).toBe(100);
    });

    it('should have status property with correct options', () => {
      const prop = discordUserTool.description.properties.find((p) => p.name === 'status');
      expect(prop).toBeDefined();
      expect(prop?.type).toBe('options');
      const options = prop?.options as Array<{ value: string }>;
      const values = options.map((o) => o.value);
      expect(values).toContain('online');
      expect(values).toContain('idle');
      expect(values).toContain('dnd');
      expect(values).toContain('invisible');
    });
  });
});
