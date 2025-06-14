cd /home/oli/ws
for f in *; do
  sudo chmod 755 $f
  sudo ln -s "/home/oli/ws/$f" "/var/www/html/$f"
done

