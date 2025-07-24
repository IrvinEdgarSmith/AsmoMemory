import { render, screen } from './test/utils';

// Simple test for the test utils themselves
describe('Test Utils', () => {
  it('can render a simple component', () => {
    const TestComponent = () => <div data-testid="test">Hello Test</div>;
    
    render(<TestComponent />);
    
    expect(screen.getByTestId('test')).toBeInTheDocument();
    expect(screen.getByText('Hello Test')).toBeInTheDocument();
  });

  it('provides mock data', () => {
    const { mockNotionToken, mockWebhookId } = require('./test/utils');
    
    expect(mockNotionToken).toBe('mock_notion_token_12345');
    expect(mockWebhookId).toBe('mock_webhook_id_67890');
  });
});