import React from 'react';
import Authorized from '@/utils/Authorized';
import { getRouteAuthority } from '@/utils/utils';

const AuthComponent = ({
  children,
  route = {
    routes: [],
  },
  location = {
    pathname: '',
  },
}) => {
  const { routes = [] } = route;

  return (
    <Authorized
      authority={getRouteAuthority(location.pathname, routes) || ''}
      noMatch={<Redirect to="/exception/403" />}
    >
      {children}
    </Authorized>
  );
};

export default AuthComponent;
