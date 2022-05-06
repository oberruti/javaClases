import React, { CSSProperties } from 'react';

import Link from 'next/link';
import { PAGES } from './utils';
import { HorizontalStack } from '../flex';
import { JustChildren } from '../../utils/tsTypes';
import { COLORS } from '../../../styles/style';

export function Menu(props: { name: string }): JSX.Element {
  const dimensions: CSSProperties = {
    marginTop: '20px',
    alignSelf: 'center',
    borderBottomColor: 'white',
    borderBottomStyle: 'solid',
    borderBottomWidth: '1px',
  };

  const linkStyle: CSSProperties = {
    color: 'white',
    textDecoration: 'none',
    textDecorationColor: 'white',
    textEmphasisColor: 'white',
    cursor: 'pointer',
  };
  return (
    <div style={dimensions}>
      <Link href={props.name}>
        <div style={linkStyle}>{props.name.toUpperCase()}</div>
      </Link>
    </div>
  );
}

export function Navigation(): JSX.Element {
  const style: CSSProperties = {
    backgroundColor: COLORS.blue,
    width: '150px',
    height: 'auto',
    minHeight: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderRightStyle: 'solid',
    borderRightColor: COLORS.green,
    borderRightWidth: '1px',
  };
  return (
    <div style={style}>
      {Object.values(PAGES).map((page) => (
        <Menu name={page} />
      ))}
    </div>
  );
}

function AppContent(props: JustChildren): JSX.Element {
  const style: CSSProperties = {
    backgroundColor: COLORS.blue,
    width: 'calc(100% - 150px)',
    minWidth: '1280px',
  };
  return <div style={style}>{props.children}</div>;
}

export const Layout = (props: JustChildren): JSX.Element => {
  const style: CSSProperties = {
    position: 'absolute',
    backgroundColor: COLORS.blue,
    height: 'auto',
    minHeight: 'calc(100% - 2px)',
    minWidth: 'calc(100% - 3px)',
    width: 'calc(100% - 3px)',
    top: 0,
    left: 0,
    borderStyle: 'solid',
    borderColor: COLORS.green,
    borderWidth: '1px',
  };
  return (
    <HorizontalStack style={style}>
      <Navigation />
      <AppContent>{props.children}</AppContent>
    </HorizontalStack>
  );
};
