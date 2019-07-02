import React from 'react';
import { IonTabBar, IonTabButton, IonLabel, IonIcon } from '@ionic/react';

export default function Footer(): JSX.Element {
  return (
    <IonTabBar slot="bottom">
      <IonTabButton tab="schedule" href="/tab1">
        <IonIcon name="flash" />
        <IonLabel>Tab One</IonLabel>
      </IonTabButton>
      <IonTabButton tab="speakers" href="/tab2">
        <IonIcon name="apps" />
        <IonLabel>Tab Two</IonLabel>
      </IonTabButton>
      <IonTabButton tab="map" href="/tab3">
        <IonIcon name="send" />
        <IonLabel>Tab Three</IonLabel>
      </IonTabButton>
    </IonTabBar>
  );
}
