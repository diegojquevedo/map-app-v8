import type { MapViewPopupContentProps } from './MapViewPopupContent.d';
import { When } from '../../../commons/When';
import { parseOrganizationForPopup } from './MapViewPopupContent.utils';
import {
  PopupInner,
  PopupHeader,
  PopupBody,
  PopupTitle,
  PopupMission,
  PopupDetails,
  PopupDetailRow,
  PopupDetailLabel,
  PopupLink
} from './MapViewPopupContent.styled';

export function MapViewPopupContent({ organization }: MapViewPopupContentProps) {
  const { name, mission, website, email, location } = parseOrganizationForPopup(organization);

  return (
    <PopupInner>
      <PopupHeader />
      <PopupBody>
        <PopupTitle>{name}</PopupTitle>
        <PopupMission>{mission}</PopupMission>
        <PopupDetails>
          <PopupDetailRow>
            <PopupDetailLabel>Location: </PopupDetailLabel>
            {location}
          </PopupDetailRow>
          <When condition={!!website}>
            <PopupDetailRow>
              <PopupDetailLabel>Website: </PopupDetailLabel>
              <PopupLink href={website}>{website}</PopupLink>
            </PopupDetailRow>
          </When>
          <When condition={!!email}>
            <PopupDetailRow>
              <PopupDetailLabel>Contact: </PopupDetailLabel>
              <PopupLink href={`mailto:${email}`}>{email}</PopupLink>
            </PopupDetailRow>
          </When>
        </PopupDetails>
      </PopupBody>
    </PopupInner>
  );
}
