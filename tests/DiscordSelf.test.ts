import { DiscordSelf } from '../src/nodes/DiscordSelf/DiscordSelf.node';
import { IExecuteFunctions } from 'n8n-workflow';

describe('DiscordSelf', () => {
  let discordSelf: DiscordSelf;

  beforeEach(() => {
    discordSelf = new DiscordSelf();
  });

  it('should be defined', () => {
    expect(discordSelf).toBeDefined();
  });

  it('should have correct node description', () => {
    expect(discordSelf.description.displayName).toBe('Discord Self-Bot');
    expect(discordSelf.description.name).toBe('discordSelf');
  });

  it('should have all required operations', () => {
    const operations = discordSelf.description.properties.find(
      (prop) => prop.name === 'operation'
    );
    
    expect(operations).toBeDefined();
    if (operations && 'options' in operations) {
      const operationValues = operations.options?.map((op: any) => op.value);
      expect(operationValues).toContain('sendMessage');
      expect(operationValues).toContain('readMessages');
      expect(operationValues).toContain('reactMessage');
      expect(operationValues).toContain('deleteMessage');
      expect(operationValues).toContain('editMessage');
      expect(operationValues).toContain('getUserInfo');
    }
  });

  it('should require credentials', () => {
    expect(discordSelf.description.credentials).toHaveLength(1);
    expect(discordSelf.description.credentials![0].name).toBe('discordSelfApi');
    expect(discordSelf.description.credentials![0].required).toBe(true);
  });
});
