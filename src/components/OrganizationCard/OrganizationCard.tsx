import { OrganizationCardProps } from './OrganizationCard.d';
import { parseOrganizationForCard } from './OrganizationCard.utils';
import { When } from '../../commons/When';
import {
  CardContainer,
  CardHeader,
  CardContent,
  CardTitle,
  CardDetails,
  MissionText,
  DetailRow,
  DetailLabel,
  DetailValue,
  DetailText
} from './OrganizationCard.styled';

export function OrganizationCard({ organization, isSelected = false, onClick }: OrganizationCardProps) {
  const handleCardClick = () => onClick(organization);
  const { address, hasMission, hasAddress, hasWebsite, hasEmail } = parseOrganizationForCard(organization);

  return (
    <CardContainer isSelected={isSelected} onClick={handleCardClick}>
      <CardHeader isSelected={isSelected} />
      
      <CardContent>
        <CardTitle>{organization.organizationName}</CardTitle>
        
        <CardDetails>
          <When condition={hasMission}>
            <MissionText>{organization.mission}</MissionText>
          </When>
          
          <When condition={hasAddress}>
            <DetailRow>
              <DetailLabel>Location:</DetailLabel>
              <DetailText>{address}</DetailText>
            </DetailRow>
          </When>
          
          <When condition={hasWebsite}>
            <DetailRow>
              <DetailLabel>Website:</DetailLabel>
              <DetailValue>{organization.website}</DetailValue>
            </DetailRow>
          </When>
          
          <When condition={hasEmail}>
            <DetailRow>
              <DetailLabel>Contact:</DetailLabel>
              <DetailValue>{organization.contactEmail}</DetailValue>
            </DetailRow>
          </When>
        </CardDetails>
      </CardContent>
    </CardContainer>
  );
}
