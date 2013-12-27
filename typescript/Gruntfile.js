

module.exports = function( grunt ){
  
	grunt.loadNpmTasks("grunt-ts")
	grunt.loadNpmTasks("grunt-contrib-copy")
	grunt.loadNpmTasks("grunt-contrib-watch")
	grunt.loadNpmTasks("grunt-simple-mocha")
    grunt.loadNpmTasks('grunt-contrib-clean')

	grunt.initConfig({
    watch: {
      scripts: {
        files: ['src/*.jt'],
        tasks: ['ts:main', 'simplemocha'],
        options: { spawn: false, }
      },
    },
    
		ts: {
      options: {
          target: 'es3',
          module: 'commonjs',
          sourcemap: false,
          declaration: false,                
          comments: false 
      },
			main: { outDir: 'build/', src: ["src/*.ts"] }
		},
		
		clean: {
      all:  [ 'build/**' ]
		},
		
    simplemocha: {
      options: {
        globals: ['should'],
        timeout: 3000,
        ignoreLeaks: false,
        // grep: '*-test',
        ui: 'bdd',
        reporter: 'tap'
      },
      main: { src: ['build/*.test.js' ]}
    }
	})

	grunt.registerTask( 'main', [ 'clean', 'ts:main', 'simplemocha:main'] );

}

