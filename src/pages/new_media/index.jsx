import React, { useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ComCompanyMedia from './components/ComCompanyMedia';
import ComSongMedia from './components/ComSongMedia';
import ComImportSongMedia from './components/ComImportSongMedia';

const new_media = props => {
  const {
    match,
  } = props;
  const [pageTitle, setPageTitle] = useState('');

  return (
    <PageHeaderWrapper
      title={
        (match.params.id)
          ? (`${pageTitle}`)
          : ('新媒體')
      }
    >
      {
        (match.params.id)
          ? (
            (match.path.indexOf('import_song_media') >= 0)
              ? (
                <ComImportSongMedia
                  pageId={match.params.id}
                  setPageTitle={setPageTitle}
                />
              )
              : (
                <ComSongMedia
                  pageId={match.params.id}
                  setPageTitle={setPageTitle}
                />
              )
          )
          : (<ComCompanyMedia pageId={match.params.id} />)
      }
    </PageHeaderWrapper>
  );
}

export default new_media;