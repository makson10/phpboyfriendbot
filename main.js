require('module-alias/register');
require("dotenv").config();

require('./server');
require('@emitters/errorEmitters');
require('@emitters/simpleFunctionsEmitters');
require('@emitters/lessonsPinEmitters');
require('@emitters/linkMessageEmitters');