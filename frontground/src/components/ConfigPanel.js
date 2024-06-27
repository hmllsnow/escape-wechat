import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import api from '../services/api';
import './ConfigPanel.css';

const ConfigPanel = () => {
  const [config, setConfig] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const data = await api.getConfig();
      setConfig(data);
    } catch (error) {
      console.error('获取配置失败:', error);
    }
  };

  const handleEdit = (section, subSection, index) => {
    setEditingIndex({ section, subSection, index });
  };

  const handleSave = (section, subSection, index) => {
    setEditingIndex(null);
  };

  const handleDelete = (section, subSection, index) => {
    if (window.confirm('确定要删除吗?')) {
      const newConfig = { ...config };
      newConfig[section][subSection].splice(index, 1);
      setConfig(newConfig);
    }
  };

  const handleAdd = (section, subSection) => {
    const newConfig = { ...config };
    newConfig[section][subSection].push({
      mentionMe: false,
      mentionAll: false,
    });
    setConfig(newConfig);
    setEditingIndex({ section, subSection, index: newConfig[section][subSection].length - 1 });
  };

  const handleChange = (section, subSection, index, key, value) => {
    const newConfig = { ...config };
    if (key === 'mentionMe' || key === 'mentionAll') {
      newConfig[section][subSection][index][key] = value === undefined ? false : value;
    } else {
      newConfig[section][subSection][index][key] = value;
    }
    setConfig(newConfig);
  };

  const handleDragEnd = (result, section, subSection) => {
    if (!result.destination) {
      return;
    }

    const newConfig = { ...config };
    const items = Array.from(newConfig[section][subSection]);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    newConfig[section][subSection] = items;
    setConfig(newConfig);
  };

  const saveConfig = async () => {
    if (editingIndex !== null) {
      alert('还有行处于编辑状态,请先保存或取消编辑');
      return;
    }
    const cleanedConfig = { ...config };

    // 清理空的keywords和regex
    Object.keys(cleanedConfig).forEach((section) => {
      Object.keys(cleanedConfig[section]).forEach((subSection) => {
        if (Array.isArray(cleanedConfig[section][subSection])) {
          cleanedConfig[section][subSection] = cleanedConfig[section][subSection].map((item) => {
            if (item.keywords && item.keywords.length === 0) {
              delete item.keywords;
            }
            if (!item.regex) {
              delete item.regex;
            }
            return item;
          });
        }
      });
    });

    try {
      console.log('保存配置:', cleanedConfig);
      let res = ""
      res = await api.uploadConfig(cleanedConfig);
      console.log('配置保存成功,后端返回',res);
      alert('参数保存成功');
    } catch (error) {
      console.error('配置保存失败:', error);
      alert('参数保存失败');
    }
  };

  if (!config) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>配置面板</h2>
      <div>
        <h3>个人</h3>
        <ConfigSection
          section="personal"
          config={config.personal}
          onEdit={handleEdit}
          onSave={handleSave}
          onDelete={handleDelete}
          onAdd={handleAdd}
          onChange={handleChange}
          onDragEnd={handleDragEnd}
          editingIndex={editingIndex}
        />
      </div>
      <div>
        <h3>群组</h3>
        <ConfigSection
          section="room"
          config={config.room}
          onEdit={handleEdit}
          onSave={handleSave}
          onDelete={handleDelete}
          onAdd={handleAdd}
          onChange={handleChange}
          onDragEnd={handleDragEnd}
          editingIndex={editingIndex}
        />
      </div>
      <br></br>
      <button onClick={saveConfig}>保存配置</button>
    </div>
  );
};

const ConfigSection = ({
  section,
  config,
  onEdit,
  onSave,
  onDelete,
  onAdd,
  onChange,
  onDragEnd,
  editingIndex,
}) => {
  return (
    <div>
      <ConfigSubSection
        section={section}
        subSection="reply"
        subSectionName="回复配置"
        config={config.reply}
        onEdit={onEdit}
        onSave={onSave}
        onDelete={onDelete}
        onAdd={onAdd}
        onChange={onChange}
        onDragEnd={onDragEnd}
        editingIndex={editingIndex}
      />
      <ConfigSubSection
        section={section}
        subSection="forward"
        subSectionName="转发配置"
        config={config.forward}
        onEdit={onEdit}
        onSave={onSave}
        onDelete={onDelete}
        onAdd={onAdd}
        onChange={onChange}
        onDragEnd={onDragEnd}
        editingIndex={editingIndex}
      />
      <ConfigSubSection
        section={section}
        subSection="actions"
        subSectionName="动作配置"
        config={config.actions}
        onEdit={onEdit}
        onSave={onSave}
        onDelete={onDelete}
        onAdd={onAdd}
        onChange={onChange}
        onDragEnd={onDragEnd}
        editingIndex={editingIndex}
      />
      <ConfigSubSection
        section={section}
        subSection="nontext"
        subSectionName="非文本（转发）配置"
        config={config.nontext}
        onEdit={onEdit}
        onSave={onSave}
        onDelete={onDelete}
        onAdd={onAdd}
        onChange={onChange}
        onDragEnd={onDragEnd}
        editingIndex={editingIndex}
      />
    </div>
  );
};

const ConfigSubSection = ({
  section,
  subSection,
  subSectionName,
  config,
  onEdit,
  onSave,
  onDelete,
  onAdd,
  onChange,
  onDragEnd,
  editingIndex,
}) => {
  const isEditing = (index) =>
    editingIndex &&
    editingIndex.section === section &&
    editingIndex.subSection === subSection &&
    editingIndex.index === index;

  const parseKeywords = (keywords) => {
    if (Array.isArray(keywords)) {
      return keywords.map((keyword) => keyword.replace(/,/g, '\\,')).join(', ');
    }
    return keywords;
  };

  const stringifyKeywords = (keywords) => {
    if (typeof keywords === 'string') {
      return keywords === '*'
        ? '*'
        : keywords.split(',').map((keyword) => keyword.trim()).filter((keyword) => keyword !== '');
    }
    return keywords;
  };

  return (
    <div>
      <h4>{subSectionName}</h4>
      <DragDropContext onDragEnd={(result) => onDragEnd(result, section, subSection)}>
        <table>
          <thead>
            <tr>
              <th>Whitelist</th>
              {subSection !== 'nontext' && <th>Keywords</th>}
              {subSection !== 'nontext' && <th>Regex</th>}
              <th>Handler/Action</th>
              {section === 'room' && <th>Talkers</th>}
        
              {section === 'room' && subSection !== 'nontext' && subSection !== 'actions' && <th>Mention Me</th>}
              {section === 'room' && subSection !== 'nontext' && subSection !== 'actions' && <th>Mention All</th>}
              {(section === 'personal' && subSection === 'forward') ||
                (section === 'personal' && subSection === 'nontext') ||
                (section === 'room' && subSection === 'forward') ||
                (section === 'room' && subSection === 'nontext') ? (
                  <>
                    <th>Target Contacts</th>
                    <th>Target Rooms</th>
                  </>
                ) : null}
              <th>Actions</th>
            </tr>
          </thead>
          <Droppable droppableId={`${section}-${subSection}`}>
            {(provided) => (
              <tbody {...provided.droppableProps} ref={provided.innerRef}>
                {Array.isArray(config) && config.map((item, index) => (
                  <Draggable key={index} draggableId={`${section}-${subSection}-${index}`} index={index}>
                    {(provided) => (
                      <tr
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <td>
                          {isEditing(index) ? (
                            <input
                              type="text"
                              value={Array.isArray(item.whitelist) ? item.whitelist.join(', ') : item.whitelist}
                              onChange={(e) =>
                                onChange(
                                  section,
                                  subSection,
                                  index,
                                  'whitelist',
                                  e.target.value === '*' ? '*' : e.target.value.split(',').map((item) => item.trim())
                                )
                              }
                            />
                          ) : (
                            JSON.stringify(item.whitelist)
                          )}
                        </td>
                        {subSection !== 'nontext' && (
                          <td>
                            {isEditing(index) ? (
                              <input
                                type="text"
                                value={parseKeywords(item.keywords)}
                                onChange={(e) =>
                                  onChange(
                                    section,
                                    subSection,
                                    index,
                                    'keywords',
                                    stringifyKeywords(e.target.value)
                                  )
                                }
                              />
                            ) : (
                              JSON.stringify(item.keywords)
                            )}
                          </td>
                        )}
                        {subSection !== 'nontext' && (
                          <td>
                            {isEditing(index) ? (
                              <input
                                type="text"
                                value={item.regex || ''}
                                onChange={(e) =>
                                  onChange(section, subSection, index, 'regex', e.target.value)
                                }
                              />
                            ) : (
                              item.regex || ''
                            )}
                          </td>
                        )}
                        <td>
                          {isEditing(index) ? (
                            <input
                              type="text"
                              value={item.handler || item.action}
                              onChange={(e) =>
                                onChange(section, subSection, index, 'handler', e.target.value)
                              }
                            />
                          ) : (
                            item.handler || item.action
                          )}
                        </td>
                        {section === 'room' && (
                          <td>
                            {isEditing(index) ? (
                              <input
                                type="text"
                                value={Array.isArray(item.talkers) ? item.talkers.join(', ') : item.talkers}
                                onChange={(e) =>
                                  onChange(
                                    section,
                                    subSection,
                                    index,
                                    'talkers',
                                    e.target.value === '*' ? '*' : e.target.value.split(',').map((item) => item.trim())
                                  )
                                }
                              />
                            ) : (
                              JSON.stringify(item.talkers)
                            )}
                          </td>
                        )}
                       {section === 'room' && subSection !== 'nontext' && subSection !== 'actions' && (
                        <td>
                          <select
                            value={item.mentionMe}
                            onChange={(e) =>
                              onChange(section, subSection, index, 'mentionMe', e.target.value === 'true')
                            }
                            disabled={!isEditing(index)}
                          >
                            <option value={true}>True</option>
                            <option value={false}>False</option>
                          </select>
                        </td>
                      )}
                      {section === 'room' && subSection !== 'nontext' && subSection !== 'actions' && (
                        <td>
                          <select
                            value={item.mentionAll}
                            onChange={(e) =>
                              onChange(section, subSection, index, 'mentionAll', e.target.value === 'true')
                            }
                            disabled={!isEditing(index)}
                          >
                            <option value={true}>True</option>
                            <option value={false}>False</option>
                          </select>
                        </td>
                      )}
                        {(section === 'personal' && subSection === 'forward') ||
                          (section === 'personal' && subSection === 'nontext') ||
                          (section === 'room' && subSection === 'forward') ||
                          (section === 'room' && subSection === 'nontext') ? (
                            <>
                              <td>
                                {isEditing(index) ? (
                                  <input
                                    type="text"
                                    value={Array.isArray(item.targetContacts) ? item.targetContacts.join(', ') : item.targetContacts}
                                    onChange={(e) =>
                                      onChange(
                                        section,
                                        subSection,
                                        index,
                                        'targetContacts',
                                        e.target.value.split(',').map((item) => item.trim())
                                      )
                                    }
                                  />
                                ) : (
                                  JSON.stringify(item.targetContacts)
                                )}
                              </td>
                              <td>
                                {isEditing(index) ? (
                                  <input
                                    type="text"
                                    value={Array.isArray(item.targetRooms) ? item.targetRooms.join(', ') : item.targetRooms}
                                    onChange={(e) =>
                                      onChange(
                                        section,
                                        subSection,
                                        index,
                                        'targetRooms',
                                        e.target.value.split(',').map((item) => item.trim())
                                      )
                                    }
                                  />
                                ) : (
                                  JSON.stringify(item.targetRooms)
                                )}
                              </td>
                            </>
                          ) : null}
                        <td>
                          {isEditing(index) ? (
                            <button onClick={() => onSave(section, subSection, index)}>保存</button>
                          ) : (
                            <button onClick={() => onEdit(section, subSection, index)}>编辑</button>
                          )}
                          <button onClick={() => onDelete(section, subSection, index)}>删除</button>
                        </td>
                      </tr>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </tbody>
            )}
          </Droppable>
        </table>
      </DragDropContext>
      <button onClick={() => onAdd(section, subSection)}>新增</button>
    </div>
  );
};

export default ConfigPanel;