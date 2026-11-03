import React, { useState } from 'react';
import { AuthNavigator } from './AuthNavigator';
import { AppNavigator } from './AppNavigator';

export function AppRoutes() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return isAuthenticated ? <AppNavigator /> : <AuthNavigator />;
}