import json
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


class DockerRendererConfigTests(unittest.TestCase):
    def test_dockerfile_pins_python_runtime_and_installs_repo_dependencies(self):
        dockerfile = (ROOT / "Dockerfile").read_text(encoding="utf-8")
        self.assertIn("FROM python:3.11.9-slim", dockerfile)
        self.assertIn("apt-get install -y --no-install-recommends fonts-dejavu-core", dockerfile)
        self.assertIn("COPY requirements-dev.txt", dockerfile)
        self.assertIn("python -m pip install -r requirements-dev.txt", dockerfile)
        self.assertIn('ENTRYPOINT ["/app/scripts/docker-renderer.sh"]', dockerfile)

    def test_compose_mounts_artifacts_for_host_png_review(self):
        compose = (ROOT / "docker-compose.yml").read_text(encoding="utf-8")
        self.assertIn("renderer:", compose)
        self.assertIn("./artifacts:/app/artifacts", compose)

    def test_docker_script_exposes_verify_and_render_fixture_commands(self):
        script = (ROOT / "scripts" / "docker-renderer.sh").read_text(encoding="utf-8")
        self.assertIn('verify)', script)
        self.assertIn("python -m unittest tests/test_trn_renderer.py tests/test_trn_api_handler.py", script)
        self.assertIn("python -m behave features", script)
        self.assertIn("python -m coverage report --fail-under=100", script)
        self.assertIn("python -m coverage run --branch --source=trn_api -m unittest tests/test_trn_api_handler.py", script)
        self.assertIn('render-fixtures)', script)
        self.assertIn("python -m trn_renderer tests/fixtures/hand-authored-trn-matrix.json artifacts/fudgy-brownies-trn.png", script)
        self.assertIn("python -m trn_renderer tests/fixtures/toll-house-cookie-trn-matrix.json artifacts/toll-house-cookie-trn.png", script)

    def test_package_scripts_include_docker_workflow(self):
        package = json.loads((ROOT / "package.json").read_text(encoding="utf-8"))
        scripts = package["scripts"]
        self.assertEqual(scripts["docker:build"], "docker compose build renderer")
        self.assertEqual(scripts["docker:check"], "docker compose run --rm renderer verify")
        self.assertEqual(scripts["docker:render"], "docker compose run --rm renderer render-fixtures")


if __name__ == "__main__":
    unittest.main()
