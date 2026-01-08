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

    it('should have operation property', () => {
      const operationProp = discordUserTool.description.properties.find(
        (p) => p.name === 'operation',
      );
      expect(operationProp).toBeDefined();
      expect(operationProp?.type).toBe('options');
    });

    it('should have all expected operations', () => {
      const operationProp = discordUserTool.description.properties.find(
        (p) => p.name === 'operation',
      );
      const options = operationProp?.options as Array<{ value: string }>;
      const operationValues = options.map((o) => o.value);

      expect(operationValues).toContain('sendMessage');
      expect(operationValues).toContain('sendDM');
      expect(operationValues).toContain('readMessages');
      expect(operationValues).toContain('editMessage');
      expect(operationValues).toContain('deleteMessage');
      expect(operationValues).toContain('addReaction');
      expect(operationValues).toContain('getServerInfo');
      expect(operationValues).toContain('listServers');
      expect(operationValues).toContain('listChannels');
      expect(operationValues).toContain('listMembers');
      expect(operationValues).toContain('getUserInfo');
      expect(operationValues).toContain('searchMessages');
      expect(operationValues).toContain('setStatus');
      expect(operationValues).toContain('joinServer');
      expect(operationValues).toContain('leaveServer');
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
