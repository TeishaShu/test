import React, { useState, useEffect, useRef, Fragment } from 'react';
import {
  Card,
  Row,
  Col,
  Input,
  Form,
  Select,
  Spin,
  Tooltip,
  Button,
} from 'antd';
import styles from '@/style/style.less';
import commFn from '@/fn/comm';
import { CloseOutlined } from "@ant-design/icons";

const { Option } = Select;

const ComSong = props => {
  const [isVal, setIsVal] = useState({
    id: '',
    song_code: '',
    song_name: '',
    iswc: '',
    info: '',
  });
  const refDelete = useRef('');
  const [isList, setIsList] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  let timer;
  const searchOption = (keyword) => {
    setIsFetching(true);
    clearTimeout(timer);
    timer = setTimeout(() => {
      commFn.searchOption(keyword, '/song', (res) => {
        setIsList(res);
        setIsFetching(false);
      });
    }, 200);
  }

  const initData = () => {
    // console.log(props);
  }

  useEffect(() => {
    initData();
  }, []);

  return (
    <tr ref={refDelete}>
      <td><p>{isVal.song_code}</p></td>
      <td
        style={{ width: '500px' }}
      >
        <Form.Item>
          <Select
            showSearch
            optionFilterProp="children"
            optionLabelProp="label"
            filterOption={false}
            allowClear={true}
            notFoundContent={isFetching ? <Spin size="small" /> : null}
            value={isVal.id}
            style={{ width: '100%' }}
            onSearch={(value) => {
              searchOption(value);
            }}
            onChange={(value, option) => {
              let tmpVal = {
                id: '',
                song_code: '',
                song_name: '',
                iswc: '',
                info: '',
              };

              if (value && option) {
                tmpVal.id = option.key;
                tmpVal.song_code = option.text;
                tmpVal.song_name = option.label;
                tmpVal.iswc = option.iswc;  // TODO: 需後端增加參數
              }

              setIsVal(tmpVal);
            }}
            onFocus={() => {
              searchOption(isVal.song_name);
            }}
            onSelect={(value, option) => {
              searchOption(option.label);
            }}
          >
            {
              (isList)
                ? (
                  isList.map(d => (
                    <Option
                      key={d.id}
                      label={d.song_name}
                      text={d.song_code}
                      showtext={`${d.song_name} (${d.song_code})`}
                    >
                      {`${d.song_name} (${d.song_code})`}
                    </Option>
                  ))
                )
                : ([])
            }
          </Select>
        </Form.Item>
      </td>
      <td><p>{isVal.iswc}</p></td>
      <td>
        <Button
          type="link"
          onClick={() => {
            /*
            if (arr[idx] === undefined || arr[idx]['id'] === undefined) {
              remove(field.name);
            } else {
              let arrDel = form.getFieldValue().origin_list.slice();
              arrDel[idx]['is_delete'] = '1';
              form.setFieldsValue({ origin_list: arrDel });
            }
            changeSongInfo();
            */

            refDelete.current.style.display = 'none';
            refDelete.current.value = true;
          }}
        >
          <CloseOutlined
            className={`${styles.om_icon_btn_style} ${styles.om_color_red}`}
          />
        </Button>
      </td>
      <td><p>{isVal.info}</p></td>
    </tr>
  );
}

export default ComSong;