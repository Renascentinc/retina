<template>
  <!-- CSS inlined due to print/export library limitations -->
  <div
    class="history-table-export"
    style="width: 100%;
  font-size: 12px;
  padding: 12px 12px 0px 12px;
  display: flex;
  flex-direction: column;"
  >
    <div
      class="dt-head"
      style="display: flex;
    flex: 1 0 auto;
    border-radius: 3px;
    background-color: #404040;
    font-size: 12px;
    max-height: 40px;
    height: 40px;
    align-items: center;
    color: #fff;
    text-align: left;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
    font-weight: 600;"
    >
      <div
        class="dt-cell id"
        style="display: flex;
        flex: 0 0 45px;
        justify-content: center;
        padding: 0;"
      >
        <span>id</span>
      </div>
      <div
        class="dt-cell tool"
        style="display: flex;
        justify-content: center;
        flex: 0 0 calc(20% - 15px);
        margin-left: 10px"
      >
        <span>tool</span>
      </div>
      <div
        class="dt-cell tool"
        style="display: flex;
        justify-content: center;
        flex: 0 0 calc(20% - 15px);
        margin-left: 10px"
      >
        <span>assigned to</span>
      </div>
      <div
        class="dt-cell tool"
        style="display: flex;
        justify-content: center;
        flex: 0 0 calc(20% - 15px);
        margin-left: 10px"
      >
        <span>status</span>
      </div>
      <div
        class="dt-cell date"
        style="display: flex;
        justify-content: center;
        flex: 0 0 calc(20% - 15px);"
      >
        <span>date</span>
      </div>
      <div
        class="dt-cell action"
        style="display: flex;
        justify-content: center;
        flex: 0 0 calc(20% - 15px);"
      >
        <span>action</span>
      </div>
    </div>

    <div
      class="dt-body"
      style="display: flex;
      flex-direction: column;
      overflow: auto;
      -webkit-overflow-scrolling: touch;
      padding: 3px 4px 9px 4px;"
    >
      <transition-group name="list-element">
        <div
          v-for="entry in searchToolSnapshot"
          :key="entry.id"
          class="dt-row"
          style="display: flex;
        border-radius: 3px;
        border-bottom: solid 1px lightgray;
        background-color: white;
        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
        cursor: pointer;"
        >
          <div
            class="dt-cell id"
            style="display: flex;
          flex: 0 0 40px;
          justify-content: center;
          padding: 0;
          display: flex;
          align-items: center;
          height: 45px;
          font-weight: 600; border-right: solid 1px lightgray;"
          >
            <span>{{ entry.tool.id }}</span>
          </div>
          <div
            class="dt-cell name"
            style="display: flex;
          justify-content: flex-start;
          margin-left: 10px;
          display: flex;
          align-items: center;
          flex-direction: row;
          height: 45px;
          font-weight: 600;
          flex: 0 0 calc(20% - 15px);"
          >
            <span>{{ `${ entry.tool.brand.name } ${ entry.tool.type.name }` }}</span>
          </div>
          <div
            class="dt-cell name"
            style="display: flex;
          justify-content: flex-start;
          margin-left: 10px;
          display: flex;
          align-items: center;
          flex-direction: row;
          height: 45px;
          font-weight: 600;
          flex: 0 0 calc(20% - 15px);"
          >
            <span>{{ entry.tool.owner.type === 'USER' ? `${ entry.tool.owner.first_name } ${ entry.tool.owner.last_name }` : entry.tool.owner.name }}</span>
          </div>
          <div
            class="dt-cell name"
            style="display: flex;
          justify-content: flex-start;
          margin-left: 10px;
          display: flex;
          align-items: center;
          flex-direction: row;
          height: 45px;
          font-weight: 600;
          flex: 0 0 calc(20% - 15px);"
          >
            <span>{{ entry.tool.status }}</span>
          </div>
          <div
            class="dt-cell date"
            style="display: flex;
          justify-content: center;
          display: flex;
          align-items: center;
          height: 45px;
          font-weight: 600;
          flex: 0 0 calc(20% - 15px);"
          >
            <span>{{ new Date(entry.metadata.timestamp).toLocaleDateString('en-US') }}</span>
          </div>
          <div
            class="dt-cell action"
            style="display: flex;
          justify-content: center;
          flex: 0 0 calc(20% - 15px);
          display: flex;
          align-items: center;
          height: 45px;
          font-weight: 600;"
          >
            <span>{{ entry.metadata.tool_action }}</span>
          </div>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script>

export default {
  name: 'HistoryTable',

  props: {
    searchToolSnapshot: {
      type: Array,
      required: true
    }
  }
}
</script>
