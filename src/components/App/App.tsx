import { MapView } from '../MapView';
import { SearchPanel } from '../SearchPanel';
import { When } from '../../commons/When';
import { useApp } from './useApp';
import {
  AppContainer,
  AppGrid,
  LoadingContainer,
  LoadingContent,
  LoadingSpinner,
  LoadingText,
  ErrorContainer,
  ErrorContent,
  ErrorIconContainer,
  ErrorIcon,
  ErrorMessage,
  ErrorDetails,
  RetryButton
} from './App.styled';

export function App() {
  const {
    organizations,
    selectedOrganization,
    loading,
    error,
    errorDetails,
    handleOrganizationSelect,
    handleMarkerClick,
    handleClearSelection,
    handleReload
  } = useApp();

  return (
    <>
      <When condition={loading}>
        <LoadingContainer>
          <LoadingContent>
            <LoadingSpinner />
            <LoadingText>Loading ocean research organizations...</LoadingText>
          </LoadingContent>
        </LoadingContainer>
      </When>

      <When condition={!!error}>
        <ErrorContainer>
          <ErrorContent>
            <ErrorIconContainer>
              <ErrorIcon />
            </ErrorIconContainer>
            <ErrorMessage>{error}</ErrorMessage>
            <When condition={!!errorDetails}>
              <ErrorDetails>{errorDetails}</ErrorDetails>
            </When>
            <RetryButton onClick={handleReload} />
          </ErrorContent>
        </ErrorContainer>
      </When>

      <When condition={!loading && !error}>
        <AppContainer>
          <AppGrid>
            <SearchPanel
              organizations={organizations}
              selectedOrganization={selectedOrganization}
              onOrganizationSelect={handleOrganizationSelect}
              onClearSelection={handleClearSelection}
            />
            <MapView
              organizations={organizations}
              selectedOrganization={selectedOrganization}
              onMarkerClick={handleMarkerClick}
            />
          </AppGrid>
        </AppContainer>
      </When>
    </>
  );
}
