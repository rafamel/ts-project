import React from 'react';
import { platform } from '~/utils';
import {
  IonIcon,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonTitle
} from '@ionic/react';

export default function Header(): JSX.Element {
  return (
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonButton>
            <IonIcon slot="icon-only" name="contact" />
          </IonButton>
        </IonButtons>
        <IonButtons slot="end">
          <IonButton>
            <IonIcon
              slot="icon-only"
              name="search"
              color={platform.on({ ios: 'dark' })}
            />
          </IonButton>
          <IonButton>
            <IonIcon
              slot="icon-only"
              name="more"
              color={platform.on({ ios: 'dark' })}
            />
          </IonButton>
        </IonButtons>
        <IonTitle>App Name</IonTitle>
      </IonToolbar>
    </IonHeader>
  );
}
