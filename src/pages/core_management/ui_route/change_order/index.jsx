import React, { useState, useEffect, useCallback, useRef } from "react";
import ReactDOM from "react-dom";
import styles from './index.less';
import {
  Table,
  Button,
  Input,
  Row,
  Col,
  Card,
} from "antd";
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'umi';
import { DndProvider, useDrag, useDrop, createDndContext } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import update from "immutability-helper";

const RNDContext = createDndContext(HTML5Backend);
const type = "DragableBodyRow";
const DragableBodyRow = ({
  index,
  moveRow,
  className,
  style,
  ...restProps
}) => {
  const ref = React.useRef();
  const [{ isOver, dropClassName }, drop] = useDrop({
    accept: type,
    collect: (monitor) => {
      const { index: dragIndex } = monitor.getItem() || {};
      if (dragIndex === index) {
        return {};
      }
      return {
        isOver: monitor.isOver(),
        dropClassName:
          dragIndex < index ? " drop-over-downward" : " drop-over-upward"
      };
    },
    drop: (item) => {
      moveRow(item.index, index);
    }
  });
  const [, drag] = useDrag({
    item: { type, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });
  drop(drag(ref));
  return (
    <tr
      ref={ref}
      className={`${className}${isOver ? dropClassName : ""}`}
      style={{ cursor: "move", ...style }}
      {...restProps}
    />
  );
};

const columns = [
  {
    title: 'id',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'function_id',
    dataIndex: 'function_id',
    key: 'function_id'
  },
  {
    title: 'layout',
    dataIndex: 'layout',
    key: 'layout'
  },
  {
    title: 'path',
    dataIndex: 'path',
    key: 'path'
  },
  {
    title: 'parent_id',
    dataIndex: 'parent_id',
    key: 'parent_id'
  },
  {
    title: 'setting_order',
    dataIndex: 'setting_order',
    key: 'setting_order',
  },
  {
    title: 'description',
    dataIndex: 'description',
    key: 'description'
  },
  {
    title: 'notes',
    dataIndex: 'notes',
    key: 'notes'
  },
  {
    title: 'is_status',
    dataIndex: 'is_status',
    key: 'is_status'
  },
];

export const changeOrder = props => {
  const {
    dispatch,
    uirouteList: { changeId, list },
  } = props;
  const [data, setData] = useState([]);

  // api -----
  const getData = () => {
    dispatch({
      type: 'uirouteList/fetchGetList',
    });
  }

  // mount
  useEffect(() => {
    getData();
  }, []);

  // updateData
  useEffect(() => {
    setData(list);
  }, [changeId]);

  // ui -----
  const components = {
    body: {
      row: DragableBodyRow
    }
  };

  const moveRow = useCallback(
    (dragIndex, hoverIndex) => {
      const dragRow = data[dragIndex];
      setData(
        update(data, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragRow]
          ]
        })
      );
    },
    [data]
  );

  const manager = useRef(RNDContext);

  return (
    <PageHeaderWrapper
      title="UI 路由 - 修改順序"
    >
      <Card bordered={false} className={styles.drag_table}>
        <Row>
          <Col
            xs={24}
          >
            <DndProvider
              manager={manager.current.dragDropManager}
            >
              <Button
                onClick={() => {
                  console.log(data);
                }}
              >
                test
              </Button>
              <Table
                pagination={false}
                columns={columns}
                dataSource={data}
                components={components}
                onRow={(record, index) => ({
                  index,
                  moveRow
                })}
                rowKey="id"
              />
            </DndProvider>
          </Col>
        </Row>
      </Card>
    </PageHeaderWrapper>
  );
};

export default connect(({ uirouteList, loading }) => ({
  uirouteList,
  loading: loading.models.uirouteList,
}))(changeOrder);