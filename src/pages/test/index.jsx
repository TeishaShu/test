import React, { useEffect, useState, Fragment } from 'react';
import {
  Input,
  Button,
  notification,
  Upload,
  message,
} from 'antd';
import { ExclamationCircleFilled, UploadOutlined } from '@ant-design/icons';
import commFn from '@/fn/comm';
import ComTest from './components/ComTest';

const test = props => {
  // test api
  const [method, setMethod] = useState('');
  const [api, setApi] = useState('');
  const [parameter, setParameter] = useState('');
  const [result, setResult] = useState('');
  // test download
  const [downloadApi, setDownloadApi] = useState('');
  const [uploadApi, setUploadApi] = useState('');

  const clicktest = () => {
    let obj = {
      // headers: {
      //   'Accept': 'application/json',
      //   'Content-Type': 'application/json'
      // },
      method: method,
      body: parameter,
    };

    if (method == 'get') {
      delete obj.method;
      delete obj.body;
    }

    fetch(
      `${window.FRONTEND_WEB}${api}${(method == 'get' ? parameter : '')}`,
      (method == 'get' ? null : obj)
    ).then(res => {
      if (typeof res == 'string' && res.indexOf('<!DOCTYPE html>') >= 0) {
        return 'error';
      } else {
        return res.json();
      }
    }).then(data => {
      if (typeof data == 'object') {
        setResult(JSON.stringify(data));
      } else {
        setResult('error');
      }
    }).catch(error => {
      setResult('error');
    });
  }

  /*
  const downloadtest = props => {
    fetch('https://enterprise-bin-music-dev.omusic.com.tw:10082/frontend/contract_author/download')
      .then((result) => {
        if (result != 'error') {
          if (result && typeof (result) == 'string') {
            commFn.downloadFile(`${window.FRONTEND_WEB}/File/download?id=${result}`, `${row.company_name}.xlsx`);
          } else {
            notification.error({
              duration: 0,
              icon: <ExclamationCircleFilled style={{ color: '#F9B006' }} />,
              message: '檔案沒有資料或錯誤'
            });
          }
        }
      }).catch(() => {
        console.log('err');
      });
  }
  */

  const files = {
    name: 'upload_files[]',
    action: `${window.FRONTEND_WEB}${uploadApi}`,
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  return (
    <Fragment>
      <div>
        <p>test icon -----</p>
        <ComTest style={{ fontSize: '40px' }} />
        <br /><br />
      </div>
      <div>
        <p>test api -----</p>
        <Input
          placeholder="Method"
          onChange={(e) => {
            setMethod(e.target.value);
          }}
        />
        <br /><br />

        <Input
          placeholder="API"
          onChange={(e) => {
            setApi(e.target.value);
          }}
        />
        <br /><br />

        <Input
          placeholder="parameter"
          onChange={(e) => {
            setParameter(e.target.value);
          }}
        />
        <br /><br />

        <Button onClick={() => { clicktest(); }}>Send</Button>
        <br /><br />

        <p>Result:</p>
        <p>{result}</p>
        <br /><br />
      </div>
      <div>
        <p>test attachment -----</p>
        <p>upload</p>
        <Input
          placeholder="uploadApi, ex: '/contract_author/upload'"
          onChange={(e) => {
            setUploadApi(e.target.value);
          }}
        />
        <Upload {...files}>
          <Button icon={<UploadOutlined />}>Upload</Button>
        </Upload>,

        <p>download</p>
        <Input
          placeholder="downloadApi, ex: '/contract_author/download'"
          onChange={(e) => {
            setDownloadApi(e.target.value);
          }}
        />
        {/* <button onClick={() => { downloadtest(); }}>download</button> */}
        <a href={`${window.FRONTEND_WEB}${downloadApi}`} download>download href</a>
      </div>
    </Fragment>
  );
}

export default test;