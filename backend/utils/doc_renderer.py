import io
from os import path

from rnd_hack import settings

from relatorio.templates.opendocument import Template


class DocRenderer:
    def __init__(self, template_name):
        self.template_name = template_name

    def render(self, data) -> io.BytesIO:
        template_path = path.join(settings.TEMPLATES_ROOT, self.template_name)
        template = Template(source='', filepath=template_path)
        generated = template.generate(o=data).render()

        output = io.BytesIO()
        output.write(generated.getvalue())
        output.seek(0)

        return output
