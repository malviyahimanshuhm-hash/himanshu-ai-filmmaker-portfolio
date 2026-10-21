import { Lightbulb, PenTool, Image, Video, Scissors, Camera, Layers, Play } from 'lucide-react';
import './Process.css';

const PROCESS_STEPS = [
  { icon: Lightbulb, title: '1. Narrative Concept', description: 'Developing the high-concept story, emotional beats, and thematic core.' },
  { icon: Camera, title: '2. Visual Scripting', description: 'Defining shot lists, camera blocking, focal lengths, and lighting design.' },
  { icon: PenTool, title: '3. Prompt Architecture', description: 'Crafting structured multi-layer prompts with consistent character seeds.' },
  { icon: Image, title: '4. Art & Style Anchoring', description: 'Generating visual references, tone boards, and aesthetic benchmarks.' },
  { icon: Video, title: '5. AI Video Generation', description: 'Iterative latent motion passes, frame interpolation, and camera physics.' },
  { icon: Scissors, title: '6. Editorial Assembly', description: 'Pacing the edit, matching eye lines, and building dramatic tension.' },
  { icon: Layers, title: '7. Multi-Pass Finishing', description: 'Color grading, grain matching, texture polish, and sound design.' },
  { icon: Play, title: '8. Cinema Mastering', description: 'Final export in 4K DCI theatrical / vertical social formats.' },
];

export const Process = () => {
  return (
    <section id="process" className="process" aria-label="Filmmaking Process">
      <div className="process-container">
        <div className="section-header">
          <div className="section-tag">
            <Layers size={15} />
            <span>WORKFLOW PIPELINE</span>
          </div>
          <h2 className="section-title">The Creative Process</h2>
          <p className="section-subtitle">
            From script concept to final cinema master — a disciplined hybrid pipeline uniting human directorial vision with generative AI tools.
          </p>
        </div>

        <div className="process-grid">
          {PROCESS_STEPS.map((step, index) => (
            <div key={index} className="process-step">
              <div className="step-number">{index + 1}</div>
              <div className="step-content">
                <div className="step-icon">
                  <step.icon size={22} />
                </div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
