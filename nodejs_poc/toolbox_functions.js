// Engine generate command module
'use strict';

var imageName = 'marvinaiplatform/marvin-automl:0.0.1'
var containerName = 'docker-api-test'

const {Docker} = require('node-docker-api');

// Log capture function
const promisifyStream = stream => new Promise((resolve, reject) => {
  stream.on('data', data => console.log(data.toString()))
  stream.on('end', resolve)
  stream.on('error', reject)
});

const docker = new Docker({ socketPath: '/var/run/docker.sock' });
let _container;

// Start container, run engine generate command and capture logs
docker.container.create({
  Image: imageName,
  Cmd: [ '/bin/bash', '-c', 'tail -f /var/log/dmesg' ],
  name: containerName
})
  .then(container => container.start())
  .then(container => {
  	_container = container
  	return container.exec.create({
  		AttachStdout: true,
  		AttachStderr: true,
  		Cmd: ['workon python-toolbox-env', 'marvin engine-generate']
  	})
  })
  .then(exec => {
    return exec.start({ Detach: false })
  })
  .then(stream => promisifyStream(stream))
  .catch(error => console.log(error));

  ### TO DO ###
  // User instructions for inserting project name, maintainer name and etc....