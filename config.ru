# This is a simple static file server for testing the example site
# Simple start a rack server in the current directory using a command like
#   rackup -s thin
# Then you can see the sample site at http://localhost:9292/examples/index.html
# This is needed for browsers that don't allow loading local script files on demand.

run Rack::Directory.new('.');