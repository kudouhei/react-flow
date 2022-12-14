import React from 'react';

import Handle from '../Handle';

const nodeStyles = {
  background: '#55ff99',
  padding: 10,
  borderRadius: 5
};

export default ({ data, style }) => (
  <div style={{ ...nodeStyles, ...style }}>
    <Handle style={{ top: 0 }} />
    {data.label}
  </div>
);
