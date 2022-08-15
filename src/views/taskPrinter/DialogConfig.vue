<template>
  <el-dialog :visible.sync="visible"
             title="请登录"
             append-to-body>
    <div class="dialog-body">
      <el-form ref="ruleForm"
               size="small"
               :model="form"
               label-width="100px"
               @submit.native.prevent>
        <!--        <el-form-item label="系统" required prop="system">-->
        <!--          <el-radio-group v-model="form.system">-->
        <!--            <el-radio-button label="Jira" value="Jira"/>-->
        <!--            <el-radio-button label="飞书(开发中)" value="飞书"/>-->
        <!--          </el-radio-group>-->
        <!--        </el-form-item>-->
        <!--        <el-form-item label="API Host" required prop="host">-->
        <!--          <el-input v-model="form.host" placeholder="请输入API Host, 例http://192.168.0.45:9090"/>-->
        <!--        </el-form-item>-->
        <el-form-item label="用户名" required prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名"/>
        </el-form-item>
        <el-form-item label="密码" required prop="credential">
          <el-input v-model="form.credential" placeholder="请输入密码" show-password/>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer">
      <el-button size="small" @click="visible=false">取&#12288;消</el-button>
      <el-button size="small" type="primary" @click="onConfirm">登&#12288;录</el-button>
    </div>
  </el-dialog>
</template>

<script>
// @ is an alias to /src
// import { random } from 'lodash';
// import { getAction } from '@/service/axiosInterceptor';
// import * as moment from 'moment';
import * as base64 from 'js-base64';

export default {
  name: 'TaskPrinterDialogConfig',
  components: {},
  data() {
    return {
      form: { system: 'Jira' },
      visible: false,
    };
  },
  mounted() {
  },
  methods: {
    show() {
      const { username } = JSON.parse(localStorage.getItem('TaskPrinterConf') || '{}');
      // const aaa = base64.decode(conf.auth || '');
      // eslint-disable-next-line prefer-destructuring
      // conf.username = aaa.split(':')[0];
      this.form = { username };
      this.visible = true;
    },
    onConfirm() {
      // eslint-disable-next-line object-curly-newline
      const { username, credential } = this.form;
      localStorage.setItem('TaskPrinterConf', JSON.stringify({
        username,
        credential: base64.encode(`${credential}`),
      }));
      this.visible = false;
      this.$emit('onSave');
    },
  },
};
</script>
<style lang="less">
</style>
