import React, { useContext } from 'react';
import { IContext } from '~/types';

const context = React.createContext<IContext>(null as any);

export const ContextualProvider = context.Provider;
export const useContextual = (): IContext => useContext(context);
