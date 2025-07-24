import { render, RenderOptions } from '@testing-library/react';
import { ReactElement, ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a test query client
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

// Provider wrapper for tests
const TestWrapper = ({ children }: { children: ReactNode }) => {
  const queryClient = createTestQueryClient();
  
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

// Custom render function
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: TestWrapper, ...options });

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };

// Mock data generators
export const mockNotionToken = 'mock_notion_token_12345';
export const mockWebhookId = 'mock_webhook_id_67890';

export const mockNotionDatabase = {
  id: 'mock_db_id',
  title: [{ plain_text: 'Test Database' }],
  properties: {
    Name: { id: 'title', type: 'title' },
    Status: { id: 'status', type: 'select' }
  }
};

export const mockNotionPage = {
  id: 'mock_page_id',
  properties: {
    Name: {
      title: [{ plain_text: 'Test Page' }]
    },
    Status: {
      select: { name: 'Active' }
    }
  }
};