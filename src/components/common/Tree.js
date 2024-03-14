import React, { useEffect, useState } from "react";
import { ReactComponent as ExpandLess } from "../../assets/expand_less_black_24dp.svg";
import { ReactComponent as ExpandMore } from "../../assets/expand_more_black_24dp.svg";

const styles = {
  node: {
    width: "100%",
  },
  icon: {
    width: "100%",
    height: 20,
  },
};

const ExpandIcon = (expanded) => {
  return expanded ? (
    <ExpandLess style={{ float: "left" }} />
  ) : (
    <ExpandMore style={{ float: "left" }} />
  );
};

// styles = {root, node: {paddingLeft}}
const TreeBase = ({ root, map, styles }) => {
  const paddingLeft = styles.node.paddingLeft === undefined ? 16 : styles.node.paddingLeft;

  const [expanded, setExpanded] = useState();

  const handleToggle = () => {
    // if (node.hasChildren) {
    setExpanded((prev) => !prev);
    // }
  };

  return root ? (
    <div onClick={handleToggle}>
      <div
        style={{
          width: "100%",
          height: 20,
          paddingLeft: `${root.level * paddingLeft}px`,
        }}
      >
        {root.hasChildren && <ExpandIcon expanded={expanded} />}
        <div style={{ float: "left" }}>{root.label}</div>
      </div>
      {expanded &&
        root.hasChildren &&
        root.children &&
        root.children.map((tree) => (
          <div key={tree.id}>
            <TreeBase root={tree} map={map} styles={styles} />
          </div>
        ))}
    </div>
  ) : (
    <div></div>
  );
};

const Tree = ({ root, styles }) => {
  const [tree, setTree] = useState();

  const init = (node, level, idx) => {
    const id = `${level}-${idx}`;
    const t = { ...node, level, id };
    const nextLevel = level + 1;

    if (t.children && t.children.length > 0) {
      const children = [];
      t.hasChildren = true;

      t.children.forEach((c) => {
        const child = init(c, nextLevel, idx);
        idx++;
        children.push(child);
      });

      t.children = children;
    } else {
      t.hasChildren = false;
    }
    return t;
  };

  useEffect(() => {
    const t = init(root, 0, 0);
    setTree(t);
  }, [root]);

  return <TreeBase root={tree} styles={styles} />;
};

export default Tree;
