module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jssrc: '../js/',
        jsdest: '../dist/js/',
        csssrc: '../css/',
        cssdest: '../dist/css/',
        lesssrc: '../less/',
        concat: {
            options: {
                // 定义一个用于插入合并输出文件之间的字符
                //separator: ';'
            },
            dist: {
                // 将要被合并的文件
                //src: ['<%= jsdest %>**/*.js', '<%= jsdest %>!ext4/**/*.js'],
                src: ['<%= jsdest %>**/locale.js','<%= jsdest %>**/GlobalConfig.js'
                ,'<%= jsdest %>**/GlobalFun.js','<%= jsdest %>**/BaseGrid.js'
                ,'<%= jsdest %>**/BaseTree.js','<%= jsdest %>**/Pagingtoolbar.js'
                ,'<%= jsdest %>**/Base.js','<%= jsdest %>**/WsCall_base.js'
                ,'<%= jsdest %>**/SearchField.js','<%= jsdest %>**/DateTimeField.js'
                ,'<%= jsdest %>**/checkcol.js','<%= jsdest %>**/GridPreviewPlugin.js'
                ,'<%= jsdest %>**/MyPasswordfield.js','<%= jsdest %>**/MyStateProvider.js'
                ,'<%= jsdest %>**/exUnit.js','<%= jsdest %>**/MainItemListTreeModel.js'
                ,'<%= jsdest %>**/MainItemListTreeStore.js','<%= jsdest %>**/MainItemListTree.js'
                ,'<%= jsdest %>**/ManageDfGrid.js','<%= jsdest %>**/ComboStore.js'
                ,'<%= jsdest %>**/Customer_numberGrid.js','<%= jsdest %>**/CustomerRentGridModel.js'
                ,'<%= jsdest %>**/CustomerRentGridStore.js','<%= jsdest %>**/CustomerRentGrid.js' 
                ,'<%= jsdest %>**/CustomerGridAction.js' ,'<%= jsdest %>**/CustomerGridModel.js' 
                ,'<%= jsdest %>**/CustomerGridStore.js' ,'<%= jsdest %>**/CustomerGrid.js' 
                ,'<%= jsdest %>**/Tracking_numberGridAction.js' ,'<%= jsdest %>**/Tracking_numberGridModel.js' 
                ,'<%= jsdest %>**/Tracking_numberGridStore.js' ,'<%= jsdest %>**/Tracking_numberGrid.js' 
                ,'<%= jsdest %>**/ExpressPanel.js' ,'<%= jsdest %>**/CompanyPanel.js' 
                ,'<%= jsdest %>**/index.js' 
                , '<%= jsdest %>!ext4/**/*.js'],
                // 合并后的JS文件的存放位置
                dest: '../dist/minjs/<%= pkg.name %>.js'
            }
        },
        jshint: {
            dist: {
                // define the files to lint
                files: [{
                    expand: true,
                    cwd: '<%= jssrc %>',
                    src: ['*.js', '!*.min.js'],
                    dest: '<%= jsdest %>',
                    extDot: 'last'
                }]
            },

            // configure JSHint (documented at http://www.jshint.com/docs/)
            options: {
                // more options here if you want to override JSHint defaults
                globals: {
                    jQuery: true,
                    console: true,
                    module: true
                }
            }
        },
        uglify: {
            options: {
                mangle: false,
                sourceMap: true
            },
            jsdist: {
                files: [{
                    expand: true,
                    cwd: '<%= jssrc %>',
                    src: ['**/*.js', '!ext4/**/*.js'], //, '!*.min.js'
                    dest: '<%= jsdest %>',
                    extDot: 'last'
                }]
            }
        },
        cssmin: {
            cssdist: {
                options: {
                    sourceMap: true
                },
                files: [{
                    expand: true,
                    cwd: '<%=csssrc %>',
                    src: ['*.css'],
                    dest: '<%=cssdest %>'
                }]
            }
        },
        less: {
            lessdist: {
                options: {
                    sourceMap: true
                },
                files: {
                    "<%=csssrc %>bootstrap.css": "<%=lesssrc %>btless/bootstrap.less"
                }
            },
            mylessdist: {
                files: [{
                    expand: true,
                    cwd: '<%=lesssrc %>',
                    src: ['*.less'],
                    dest: '<%=csssrc %>',
                    ext: '.css',
                    extDot: 'last'
                }]
            }
        },
        copy: {
            copyfile: {
                files: [{
                    expand: true,
                    cwd: '<%=csssrc %>img',
                    src: ['*.*'],
                    dest: '<%=cssdest %>img'
                }]
            }
        },
        watch: {
            scripts: {
                files: ['<%= jssrc %>**/*.js', '!ext4/**/*.js'],
                tasks: ['uglify']
            },
            less: {
                files: ['<%=lesssrc %>btless/*.less'],
                tasks: ['less:lessdist']
            },
            myless: {
                files: ['<%=lesssrc %>*.less'],
                tasks: ['less:mylessdist']
            },
            css: {
                files: ['<%= csssrc %>*.css'],
                tasks: ['cssmin:cssdist']
            },
            copy: {
                files: ['<%= csssrc %>img/*.*'],
                tasks: ['copy:copyfile']
            }
        }
        // watch: {
        //     files: ['<%= src %>*.js'],
        //     task: ['uglify']
        // }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.loadNpmTasks('grunt-contrib-copy');

    // 默认被执行的任务列表。
    grunt.registerTask('default', ['uglify', 'less:lessdist', 'less:mylessdist', 'cssmin', 'copy']);
    grunt.registerTask('jsdist', ['uglify:jsdist']);
    grunt.registerTask('concatdist', ['concat:dist']);
    grunt.registerTask('lessdist', ['less:lessdist']);
    grunt.registerTask('mylessdist', ['less:mylessdist']);
    grunt.registerTask('cssdist', ['cssmin:cssdist']);
    grunt.registerTask('copyfile', ['copy:copyfile']);


};
