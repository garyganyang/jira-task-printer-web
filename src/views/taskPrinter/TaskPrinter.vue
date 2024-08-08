<template>
  <el-container v-loading="loading">
    <el-header class="el-header" height="40px">
      <el-row style="margin-top: 4px">
        <el-col :span="12" style="text-align: left;font-size: 24px; color: #deebff">
          Jira 任务打印程序
          <el-popover title="版本说明" width="200" trigger="hover">
            <p>2022-03-17</p>
            <p>1. 在打印卡上增加打印人和打印时间;</p>
            <p>2022-01-14</p>
            <p>1. 修复状态查询;</p>
            <p>2. 修复预估时间精度显示问题.</p>
            <p>3. 支持bug类型显示.</p>
            <p>4. 支持列排序.</p>
            <el-button slot="reference" type="text" style="color: #deebff">v 1.0.3</el-button>
          </el-popover>
          <el-link href="http://192.168.0.45:8090/pages/viewpage.action?pageId=5767175"
                   type="warning"
                   target="_blank"
                   style="margin-left: 10px">打印机驱动下载
          </el-link>
        </el-col>
        <el-col :span="12" style="color: #deebff; text-align: right; line-height: 32px">
          <div class="grid-content bg-purple-light" style="display: inline-block;margin-right: 10px">你好，{{ myself.displayName }}</div>
          <el-button v-if="loginLoading" :loading="loginLoading" type="primary" size="small" @click="onConfig">登录中</el-button>
          <el-button v-else type="primary" size="small" @click="onConfig">登录配置</el-button>
        </el-col>
      </el-row>
    </el-header>
    <el-main style="padding: 10px">
      <div class="operation-row">
        <el-form :inline="true" :model="formInline" size="small" class="" @submit.native.prevent>
          <el-form-item label="项目">
            <el-select v-model="formInline.projectId" placeholder="选择项目" filterable @change="getAllSprints">
              <el-option v-for="(item,index) in projects" :key="index" :label="item.name" :value="item.id"/>
              <!-- <span class="ellipsis" style="float: left">{{ item.name }}</span>-->
              <!--<span style="float: right; color: #8492a6; font-size: 13px">
              {{ item.key }}</span>-->
              <!--              </el-option>-->
            </el-select>
          </el-form-item>
          <el-form-item label="Sprint">
            <el-select v-model="formInline.sprintId" placeholder="选择Sprint" @change="getIssuesForSprint">
              <el-option v-for="(item,index) in sprints" :key="index" :label="item.name" :value="item.id">
                <span class="ellipsis-70" style="float: left" :title="item.name">{{ item.name }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ sprintsStatusMap[item.state] }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="formInline.status" placeholder="任务状态" @change="getIssuesForStatus">
              <el-option v-for="(item,index) in issuesStatus" :key="index" :label="item" :value="item"/>
            </el-select>
          </el-form-item>
          <el-form-item label="任务Key">
            <el-input v-model="formInline.key" placeholder="请输入任务Key" @keyup.enter.native="onQuery"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onQuery">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button v-print="'#printTask'" type="primary">打印主任务</el-button>
            <!--<el-button v-print="printObj" type="primary">打印主任务</el-button>-->
          </el-form-item>
          <el-form-item>
            <el-button v-print="'#printSubTask'" type="primary">打印子任务</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div>
        <div style="display: flex">
          <div style="flex: 1">
            <el-table :data="issues"
                      border
                      highlight-current-row
                      tooltip-effect="dark"
                      size="small"
                      style="width: 100%"
                      height="calc(52vh)"
                      @row-click="onIssueClick">
              <!--<el-table-column type="selection" width="55" align="center"/>-->
              <el-table-column prop="key" label="Key" sortable align="center" width="100"/>
              <el-table-column prop="fields.issuetype.name" sortable label="任务类型" width="100" align="center">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.fields.issuetype.name === '故障' || scope.row.fields.issuetype.name === 'Bug'"
                          size="mini"
                          type="danger">Bug
                  </el-tag>
                  <el-tag v-else size="mini" type="success">{{ scope.row.fields.issuetype.name }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="fields.summary" sortable label="任务名称" align="left" header-align="center"/>
              <el-table-column prop="fields.sprint.name" label="Sprint" align="center" width="200"/>
              <el-table-column prop="fields.assignee.displayName" sortable label="经办人" align="center" width="100"/>
              <el-table-column prop="fields.creator.displayName" sortable label="报告人" align="center" width="100"/>
              <el-table-column prop="fields.status.name" sortable label="状态" width="100" align="center">
                <template slot-scope="scope">
                  <el-tag v-if="['待办','待处理','开放'].includes(scope.row.fields.status.name)"
                          size="mini"
                          type="info">{{ scope.row.fields.status.name }}
                  </el-tag>
                  <el-tag v-else-if="scope.row.fields.status.name === '处理中'"
                          size="mini"
                          type="danger">处理中
                  </el-tag>
                  <el-tag v-else-if="['完成','已解决'].includes(scope.row.fields.status.name)"
                          size="mini"
                          type="success">{{ scope.row.fields.status.name }}
                  </el-tag>
                  <el-tag v-else-if="scope.row.fields.status.name === '直接关闭'"
                          size="mini"
                          type="warning">直接关闭
                  </el-tag>
                  <span v-else>{{ scope.row.fields.status.name }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="fields.status.name" sortable label="版本" align="center" width="120">
                <template slot-scope="scope">
                  <el-tag v-for="(item,index) in scope.row.fields.fixVersions"
                          :key="index"
                          size="mini">{{ item.name }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="fields.epic.name" sortable label="Epic" align="center" width="120"/>
            </el-table>
            <el-table :data="subTasks"
                      border
                      highlight-current-row
                      tooltip-effect="dark"
                      size="small"
                      style="width: 100%;margin-top: 10px"
                      height="calc(30vh)"
                      @selection-change="handleSubTasksSelectionChange">
              <el-table-column type="selection" width="55" align="center"/>
              <el-table-column prop="key" label="Key" align="center" width="100"/>
              <el-table-column prop="fields.summary" label="子任务名称" align="left" header-align="center"/>
              <el-table-column prop="fields.timeoriginalestimate" label="预估时间(H)" align="left" width="100"/>
              <el-table-column prop="fields.assignee.displayName" label="经办人" align="left" width="100"/>
              <el-table-column prop="fields.creator.displayName" label="报告人" align="left" width="100"/>
              <el-table-column prop="fields.status.name" label="状态" align="left" width="100">
                <template slot-scope="scope">
                  <el-tag v-if="['待办','待处理','开放'].includes(scope.row.fields.status.name)"
                          size="mini"
                          type="info">{{ scope.row.fields.status.name }}
                  </el-tag>
                  <el-tag v-else-if="scope.row.fields.status.name === '处理中'"
                          size="mini"
                          type="danger">处理中
                  </el-tag>
                  <el-tag v-else-if="['完成','已解决'].includes(scope.row.fields.status.name)"
                          size="mini"
                          type="success">{{ scope.row.fields.status.name }}
                  </el-tag>
                  <el-tag v-else-if="scope.row.fields.status.name === '直接关闭'"
                          size="mini"
                          type="warning">直接关闭
                  </el-tag>
                  <span v-else>{{ scope.row.fields.status.name }}</span>
                </template>
              </el-table-column>
              <!--          <el-table-column fixed="right" label="操作" width="100">-->
              <!--            <template slot-scope="scope">-->
              <!--<el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>-->
              <!--              <el-button type="text" size="small">编辑</el-button>-->
              <!--            </template>-->
              <!--          </el-table-column>-->
            </el-table>
          </div>
          <div style="width: 400px;margin-top: -24px">
            <el-divider content-position="left">主任务打印预览</el-divider>
            <div style="width: 354px;margin:0 auto">
              <div id="printTask" class="jira-task">
                <div class="summary bt bl br padding">
                  {{ selectedIssue.fields.issuetype ? selectedIssue.fields.issuetype.name : '任务' }}:
                  [{{ selectedIssue.key }}]{{ selectedIssue.fields.summary }}
                </div>
                <div class="flex bt bl br">
                  <div class="flex">
                    <div class="label padding">Epic</div>
                    <div class="value padding bl">
                      {{ selectedIssue.fields.epic ? selectedIssue.fields.epic.name : '' }}
                    </div>
                  </div>
                  <div class="flex centralised">
                    <div class="label2 padding bl">版本</div>
                    <div class="value2 padding bl bold">
                      {{ selectedIssue.fields.fixVersions.map(e => e.name).join(',') || '-/-' }}
                    </div>
                  </div>
                </div>
                <div class="desc bt bl br padding font-sm">
                  {{ myself.displayName + ' print @' + queryTimeOfTask }}<br>
                  {{ selectedIssue.fields.description }}
                </div>
                <div class="flex bt bl br bb">
                  <div class="flex">
                    <div class="label padding">报告人</div>
                    <div class="value padding bl bold">
                      {{ selectedIssue.fields.creator ? selectedIssue.fields.creator.displayName : '' }}
                    </div>
                  </div>
                  <div class="flex">
                    <div class="label padding bl">经办人</div>
                    <div class="value padding bl bold">
                      {{ selectedIssue.fields.assignee ? selectedIssue.fields.assignee.displayName : '' }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <el-divider content-position="left">子任务打印预览</el-divider>
            <div style="width: 370px;margin:0 auto;height: 50vh;overflow: hidden auto;">
              <div id="printSubTask">
                <div v-for="item in selectedSubTasks"
                     :key="item.id"
                     class="jira-task"
                     style="margin-top: 4px;page-break-after:always">
                  <div class="summary bt bl br padding">
                    子任务:[{{ item.key }}]{{ item.fields.summary }}
                  </div>
                  <div class="flex bt bl br">
                    <div class="flex centralised" style="height: 38px">
                      <div class=" label padding">主任务</div>
                      <div class="flex-1 padding bl ellipsis font-sm sub-summary">
                        <span class="bold">[{{ selectedIssue.key }}]</span>
                        {{ selectedIssue.fields.summary }}
                      </div>
                    </div>
                  </div>
                  <div class="desc2 bt bl br padding font-sm">
                    {{ myself.displayName + ' print @' + queryTimeOfSubTask }}
                    <br>{{ item.fields.description }}
                  </div>
                  <div class="flex bt bl br">
                    <div class="flex">
                      <div class="label padding">报告人</div>
                      <div class="value padding bl">
                        {{ item.fields.creator ? item.fields.creator.displayName : '' }}
                      </div>
                    </div>
                    <div class="flex">
                      <div class="label padding bl">经办人</div>
                      <div class="value bold padding bl">
                        {{ item.fields.assignee ? item.fields.assignee.displayName : '' }}
                      </div>
                    </div>
                  </div>
                  <div class="flex bt bl br bb">
                    <div class="flex centralised">
                      <div class="label padding">创建</div>
                      <div class="value padding bl">
                        {{ moment(item.fields.created).format('MM-DD HH:mm') }}
                      </div>
                    </div>
                    <div class="flex">
                      <div class="label padding bl">预估</div>
                      <div class="value bold padding bl">
                        {{ item.fields.timeoriginalestimate || '-/-' }} 小时
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-main>
    <dialog-config ref="DialogConfig" @onSave="getAllProjects"/>
  </el-container>
</template>

<script>
// @ is an alias to /src
import {orderBy} from 'lodash';
import { pinyin } from 'pinyin-pro'
// import { getAction } from '@/service/axiosInterceptor';
import JiraService from '@/service/JiraService';
import * as moment from 'moment';
import DialogConfig from './DialogConfig.vue';

export default {
  name: 'About',
  components: {DialogConfig},
  data() {
    return {
      moment,
      formInline: {},
      projects: [],
      sprints: [],
      allIssues: [],
      issues: [],
      copyOfIssues: [],
      subTasks: [],
      issuesStatus: [],
      selectedIssue: {
        fields: {
          epic: {name: ''},
          fixVersions: []
        }
      },
      selectedSubTasks: [],
      sprintsStatusMap: {
        active: '进行中',
        closed: '已关闭',
        future: '未开始'
      },
      issuesStatusMap: {},
      myself: {avatarUrls: {}},
      loading: false,
      loginLoading: false,
      queryTimeOfTask: '',
      queryTimeOfSubTask: '',
    };
  },
  mounted() {
    this.getAllProjects();
    const myself = window.localStorage.getItem('JIRA_MY_PROFILE')
    if (myself) {
      this.myself = JSON.parse(myself)
    }
  },
  methods: {
    onConfig() {
      this.$refs.DialogConfig.show();
    },
    getAllProjects() {
      this.loginLoading = true
      JiraService.login().then(() => {
        JiraService.getMyself().then((res) => {
          this.myself = res.data;
          window.localStorage.setItem('JIRA_MY_PROFILE', JSON.stringify(res.data))
        });
        JiraService.getAllAgileBoard().then((page1) => {
          if (page1.data.isLast) {
            this.projects = orderBy(page1.data.values.filter(e => !e.name.includes('已结束')), e=>pinyin(e.name, { pattern: 'initial' }), 'desc');
            return
          }
          JiraService.getAllAgileBoard(50).then((page2) => {
            console.log(pinyin(page2.data.values[0].name, { pattern: 'initial' }))
            this.projects = orderBy([...page1.data.values, ...page2.data.values].filter(e => !e.name.includes('已结束')), e=>pinyin(e.name, { pattern: 'initial' }), 'desc  ');
          })
          // this.projects = res.data.values;
        });
      }).catch((reason) => {
        this.$message.error(reason.response ? reason.response.data.errorMessages[0] : reason.message);
        this.$refs.DialogConfig.show();
      }).finally(() => {
        this.loginLoading = false
      });
    },
    getAllSprints(boardId) {
      this.formInline.sprintId = '';
      this.formInline.status = '';
      this.getAllIssue(boardId);
      JiraService.getAllSprints(boardId).then((res) => {
        this.sprints = res.data.values.reverse();
      });
    },
    getAllIssue() {
      // JiraService.getAllIssue(boardId)
      //   .then((res) => {
      //     this.issues = res.data.issues.reverse();
      //   });
    },
    getIssuesForSprint(sprintId) {
      this.formInline.status = '';
      this.loading = true;
      JiraService.getIssuesForSprint(this.formInline.projectId, sprintId).then((res) => {
        this.allIssues = res.data.issues;
        this.issues = orderBy(res.data.issues.filter((e) => !e.fields.issuetype.subtask), 'fields.customfield_10100', 'asc');
        this.issuesStatus = Array.from(new Set(res.data.issues.map(e => e.fields.status.name)));
        this.copyOfIssues = this.issues;
      }).finally(() => {
        this.loading = false;
      });
    },
    getIssuesForStatus(status) {
      this.loading = true;
      this.issues = this.copyOfIssues;
      if (this.issues.length) {
        this.issues = this.issues.filter((v) => v.fields.status.name === status);
      }
      this.loading = false;
    },
    onIssueClick(row) {
      console.log(row);
      this.selectedIssue = JSON.parse(JSON.stringify(row));
      this.subTasks = row.fields.subtasks.map((eachSubTask) => {
        const theIssue = this.allIssues.find((eachIssue) => eachIssue.key === eachSubTask.key);
        if (!theIssue) return {};
        const copyOfEachSubTask = eachSubTask;
        copyOfEachSubTask.fields.created = theIssue.fields.created;
        copyOfEachSubTask.fields.assignee = theIssue.fields.assignee;
        copyOfEachSubTask.fields.creator = theIssue.fields.creator;
        copyOfEachSubTask.fields.description = theIssue.fields.description;
        copyOfEachSubTask.fields.timeoriginalestimate = (theIssue.fields.timeoriginalestimate / 3600).toFixed(1);
        return copyOfEachSubTask;
      });
      this.queryTimeOfTask = moment().format('MM-DD HH:mm');
    },
    // onSubTaskClick(row) {
    //   this.selectedIssue = row;
    // },
    onQuery() {
      if (!this.formInline.key) return;
      this.allIssues = [];
      this.issues = [];
      this.subTasks = [];
      this.loading = true;
      JiraService.getIssueByIdOrKey(this.formInline.key.toUpperCase()).then((res) => {
        if (res.data.fields.parent) {
          // eslint-disable-next-line no-param-reassign,operator-assignment
          res.data.fields.timeoriginalestimate = (res.data.fields.timeoriginalestimate / 3600).toFixed(1);
          this.subTasks = [res.data];
          JiraService.getIssueByIdOrKey(res.data.fields.parent.id).then((issue) => {
            this.selectedIssue = issue.data;
          });
          return;
        }
        this.issues = [res.data];
        res.data.fields.subtasks.forEach((eachSub) => {
          JiraService.getIssueByIdOrKey(eachSub.id).then((issue) => {
            this.allIssues.push(issue.data);
          });
        });
      }).finally(() => {
        this.loading = false;
      });
    },
    printTask() {
      if (!this.selectedIssue) return;
      this.$refs.DialogTask.show(this.selectedIssue);
    },
    handleSubTasksSelectionChange(rows) {
      this.selectedSubTasks = rows;
      this.queryTimeOfSubTask = moment().format('MM-DD HH:mm');
    }
  }
};
</script>
<style lang="less">
.el-table thead {
  color: black !important;
}

.ellipsis-70 {
  width: 70%;
  overflow: hidden;
  text-overflow: ellipsis;
}

.el-header {
  background-color: #0747a6 !important;
  color: white !important;
}

.el-button--primary {
  color: #FFF !important;
  background-color: #0052cc !important;
  border-color: #deebff !important;
}

.operation-row {
  text-align: left;
}

.graph {
  height: 450px;
  flex: 1;
  background-color: rgba(65, 0, 0, 0.05);
}

.jira-task {
  width: 350px;
  text-align: left;

  .flex-1 {
    flex: 1;
  }

  .centralised {
    justify-content: center;
    align-items: center;
  }

  .ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .padding {
    padding: 4px;
  }

  .bt {
    border-top: 1px solid black;
  }

  .bl {
    border-left: 1px solid black;
  }

  .br {
    border-right: 1px solid black;
  }

  .bb {
    border-bottom: 1px solid black;
  }

  .summary {
    font-weight: bold;
    font-size: 20px;
    overflow: hidden;
    display: -webkit-box;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2; /*要显示的行数*/
    -webkit-box-orient: vertical;
  }

  .sub-summary {
    overflow: hidden;
    display: -webkit-box;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2; /*要显示的行数*/
    -webkit-box-orient: vertical;
  }

  .flex {
    display: flex;

  }

  .desc {
    height: 110px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .desc2 {
    height: 90px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .font-sm {
    font-size: 12px;
  }

  .label {
    width: 50px;
  }

  .bold {
    font-weight: bold;
  }

  .value {
    width: 110px;
  }

  .value2 {
  }
}
</style>
