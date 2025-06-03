cd /home/oli/ws
for f in *; do
  sudo ln -s "/home/oli/ws/$f" "/var/www/html/$f"
done

