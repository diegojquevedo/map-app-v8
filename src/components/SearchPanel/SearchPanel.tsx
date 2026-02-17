import { SearchPanelProps } from './SearchPanel.d';
import { useSearchPanel } from './useSearchPanel';
import { OrganizationCard } from '../OrganizationCard';
import { When } from '../../commons/When';
import {
  PanelContainer,
  HeaderContainer,
  Title,
  SearchInputContainer,
  SearchInput,
  SearchIcon,
  ResultCount,
  ScrollableContent,
  EmptyState,
  CardList,
  CardWrapper
} from './SearchPanel.styled';

export function SearchPanel({
  organizations,
  selectedOrganization,
  onOrganizationSelect,
}: SearchPanelProps) {
  const { searchQuery, filteredOrganizations, handleSearchChange, hasNoResults, emptyMessage, organizationText } = useSearchPanel(organizations);

  return (
    <PanelContainer>
      <HeaderContainer>
        <Title>Ocean Research Organizations</Title>
        <SearchInputContainer>
          <SearchInput 
            value={searchQuery} 
            onChange={(e) => handleSearchChange(e.target.value)} 
          />
          <SearchIcon />
        </SearchInputContainer>
        <ResultCount>{organizationText}</ResultCount>
      </HeaderContainer>

      <ScrollableContent>
        <When condition={hasNoResults}>
          <EmptyState>{emptyMessage}</EmptyState>
        </When>

        <When condition={!hasNoResults}>
          <CardList>
            {filteredOrganizations.map((org, index) => (
              <CardWrapper key={`${org.organizationName}-${index}`}>
                <OrganizationCard
                  organization={org}
                  isSelected={selectedOrganization?.organizationName === org.organizationName}
                  onClick={onOrganizationSelect}
                />
              </CardWrapper>
            ))}
          </CardList>
        </When>
      </ScrollableContent>
    </PanelContainer>
  );
}
